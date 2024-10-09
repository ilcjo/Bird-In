const { Sequelize } = require("sequelize");
const { deletePhotoFromFTPPaisajes } = require("../../services/deletFtp");
const { Paisajes, Paises, Imagenes_paisajes, Zonas, PaisesconAves } = require("../../config/db/db");

const DEFAULT_PER_PAGE = 18;
const DEFAULT_PAGE = 1;

const fetchFilterLands = async (pais, zona, page, perPage) => {
    try {
        const whereClause = {};

        // Si existe un país, añadir la condición al whereClause
        if (pais) {
            whereClause.paises_id_pais = pais;
        }

        // Si existe una zona, añadir la condición al whereClause
        if (zona) {
            whereClause.zonas_id_zona = zona;
        }

        // Convertir página y cantidad por página a número, con valores predeterminados
        const pageConvert = Number(page) || DEFAULT_PAGE;
        const perPageConvert = perPage === '0' ? undefined : Number(perPage) || DEFAULT_PER_PAGE;
        const offset = perPageConvert ? (pageConvert - 1) * perPageConvert : 0;

        // Si ni país ni zona están presentes, devolver todos los paisajes sin filtro
        const RegistrosFiltrados = await Paisajes.findAll({
            where: Object.keys(whereClause).length > 0 ? whereClause : {}, // Si no hay filtros, buscar todo
            include: [
                {
                    model: Paises,
                    attributes: ['nombre', 'id_pais'],
                },
                {
                    model: Zonas,
                    attributes: [['nombre_zona', 'nombre'], 'id_zona'],
                },
                {
                    model: Imagenes_paisajes,
                    attributes: [['url_paisaje', 'url'], 'destacada']
                }
            ],
            limit: perPageConvert,
            offset: offset
        });

        // Contar el total de paisajes
        const totalResults = await Paisajes.count({
            where: Object.keys(whereClause).length > 0 ? whereClause : {} // Si no hay filtros, contar todo
        });

        const totalPages = Math.ceil(totalResults / perPageConvert);
        const isLastPage = pageConvert >= totalPages;

        return { RegistrosFiltrados, totalResults, isLastPage };
    } catch (error) {
        console.error('Ocurrió un error al realizar la consulta:', error);
        throw error;
    }
};

// const fetchFilterLands = async (pais, zona, page, perPage) => {
//     // console.log('filter', pais, zona)
//     try {
//         const whereClause = {};

//         // Condiciones para el where de Paisajes
//         if (pais) {
//             whereClause.paises_id_pais = pais;
//         }
//         if (zona) {
//             whereClause.zonas_id_zona = zona;
//         }
//         // console.log(whereClause)
//         const pageConvert = Number(page) || DEFAULT_PAGE;
//         const perPageConvert = perPage === '0' ? undefined : Number(perPage) || DEFAULT_PER_PAGE;
//         const offset = perPageConvert ? (pageConvert - 1) * perPageConvert : 0;

//         // Obtén los paisajes filtrados junto con los países y zonas asociados
//         const RegistrosFiltrados = await Paisajes.findAll({
//             where: whereClause,
//             include: [
//                 {
//                     model: Paises,
//                     attributes: ['nombre', 'id_pais'],
//                 },
//                 {
//                     model: Zonas,
//                     attributes: [['nombre_zona', 'nombre'], 'id_zona'],
//                 },
//                 {
//                     model: Imagenes_paisajes,
//                     attributes: [['url_paisaje', 'url'], 'destacada']
//                 }
//             ],
//             limit: perPageConvert,
//             offset: offset
//         });

//         // Obtén el total de paisajes para calcular el total de páginas
//         const totalResults = await Paisajes.count({ where: whereClause });

//         const totalPages = Math.ceil(totalResults / perPageConvert);
//         const isLastPage = pageConvert >= totalPages;

//         return { RegistrosFiltrados, totalResults, isLastPage };
//     } catch (error) {
//         console.error('Ocurrió un error al realizar la consulta:', error);
//         throw error; // Lanza la excepción para que pueda ser capturada en el lugar desde donde se llama la función.
//     }
// };

const fetchOptionsLand = async () => {
    const optionsPaises = await Paises.findAll({
        attributes: [['id_pais', 'id'], 'nombre',],
    });
    const optionsZonas = await Zonas.findAll({
        attributes: [['id_zona', 'id'], ['nombre_zona', 'nombre'],
        [
            Sequelize.literal('(SELECT nombre FROM paises WHERE paises.id_pais = id_paises)'),
            'nombre_pais'
        ],
        ],
        order: [
            [Sequelize.literal('(SELECT nombre FROM paises WHERE paises.id_pais = id_paises)'), 'ASC'],
            ['nombre_zona', 'ASC']
        ]
    });
    const paisIdsInPaisajes = await Paisajes.findAll({
        attributes: ['paises_id_pais'], // Solo necesitamos el ID del país
    });

    // Obtener los nombres de los países que tienen esos IDs (sin eliminar duplicados)
    const existingPaises = await Paises.findAll({
        where: {
            id_pais: paisIdsInPaisajes.map(paisaje => paisaje.paises_id_pais) // Filtramos solo los IDs encontrados
        },
        attributes: [['id_pais', 'id'], 'nombre'], // Devolvemos solo el id y el nombre
    });
    // Obtener lista de IDs de zonas que están en Paisajes (sin agrupar ni eliminar duplicados)
    const zonaIdsInPaisajes = await Paisajes.findAll({
        attributes: ['zonas_id_zona'], // Solo necesitamos el ID de la zona
    });

    // Obtener los nombres de las zonas que tienen esos IDs
    const existingZonas = await Zonas.findAll({
        where: {
            id_zona: zonaIdsInPaisajes.map(paisaje => paisaje.zonas_id_zona) // Filtramos solo los IDs encontrados
        },
        attributes: [['id_zona', 'id'], ['nombre_zona', 'nombre']], // Devolvemos solo el id y el nombre
    });

    return {
        paises: existingPaises,
        zonas: existingZonas,
        paisesAll: optionsPaises, // Lista de países en Paisajes
        zonasAll: optionsZonas // Lista de zonas en Paisajes
    };
};

const filterOptionsPaisZonasPaisaje = async (pais, zona) => {
    // console.log('primera', zona, pais);
    const perpage = '0';
    const page = '0';
    const { RegistrosFiltrados } = await fetchFilterLands(pais, zona, page, perpage);
    // console.log(RegistrosFiltrados)
    const newOptions = {
        paises: [],
        zonas: [],
    };
    if (zona) {
        const paisesSet = new Set();
        RegistrosFiltrados.forEach(paisaje => {
            if (paisaje.paise) {
                paisesSet.add(JSON.stringify({
                    id: paisaje.paise.dataValues.id_pais,
                    nombre: paisaje.paise.dataValues.nombre,
                }));
            }
        });
        // console.log(paisesSet);
        newOptions.paises = Array.from(paisesSet).map(pais => JSON.parse(pais));
    }

    if (pais) {
        const zonasSet = new Set();

        RegistrosFiltrados.forEach(paisaje => {
            if (paisaje.zona) {
                // console.log('paisaje.zona:', paisaje.zona); 
                zonasSet.add(JSON.stringify({
                    id: paisaje.zona.dataValues.id_zona,
                    nombre: paisaje.zona.dataValues.nombre,
                }));
            }
        });
        // console.log(zonasSet,'soy');
        newOptions.zonas = Array.from(zonasSet).map(zona => JSON.parse(zona));
    }

    return newOptions;
};

const sendAndCreateLand = async (
    pais,
    zona,
    descripcion,
    urlWiki,
    urlImagen,
    map
) => {
    try {
        // Verificar si tanto el país como la zona están presentes
        if (!pais) {
            throw new Error('El país es obligatorio.');
        }

        // Crear un arreglo de imágenes de paisajes a partir de las URLs proporcionadas
        const imagenesData = urlImagen.map((imageUrl) => ({
            url_paisaje: imageUrl,
        }));

        // Verificar si la zona tiene un id válido
        const zonaId = zona && zona.id ? zona.id : null;

        // Crear el registro en la tabla "Paisajes"
        const createNewRegistro = await Paisajes.create({
            descripcion: descripcion,
            url: urlWiki,
            map: map,
            paises_id_pais: pais.id,
            zonas_id_zona: zonaId, // Guardar el ID de la zona si existe, o null
            imagenes_paisajes: imagenesData
        }, {
            include: [Imagenes_paisajes]
        });

        return { message: "El paisaje se ha creado correctamente.", land: createNewRegistro };
    } catch (error) {
        console.error('Error en la consulta:', error);
        throw new Error("Ha ocurrido un error al crear el paisaje.");
    }
};


const findDataByIdP = async (id) => {
    try {
        const Registro = await Paisajes.findOne({
            where: { id: id },
            include: [
                {
                    model: Imagenes_paisajes,
                    attributes: [
                        ['url_paisaje', 'url'],
                        'id',
                        'destacada',
                        [Sequelize.literal('SUBSTRING_INDEX(url_paisaje, "_", -1)'), 'titulo']
                        ,] // Atributos que deseas de Imagenes_aves
                },
                { model: Paises, attributes: ['nombre', ['id_pais', 'id']] },
                { model: Zonas, attributes: [['nombre_zona', 'nombre'], ['id_zona', 'id']] },
            ],
            attributes: [
                'id',
                'descripcion',
                'url',
                'map'
            ] // Atributos
        });
        return Registro;
    } catch (error) {
        // Manejar errores de consulta
        console.error('Error en la consulta:', error);
        throw error;
    }
};


const findDataByNameP = async (id) => {
    try {
        const Registro = await Paisajes.findOne({
            where: { zonas_id_zona: id },
            include: [
                {
                    model: Imagenes_paisajes,
                    attributes: [
                        ['url_paisaje', 'url'],
                        'id',
                        'destacada',
                        [Sequelize.literal('SUBSTRING_INDEX(url_paisaje, "_", -1)'), 'titulo']
                        ,] // Atributos que deseas de Imagenes
                },
                { model: Paises, attributes: ['nombre', ['id_pais', 'id']] },
                { model: Zonas, attributes: [['nombre_zona', 'nombre'], ['id_zona', 'id']] },
            ],
            attributes: [
                'id',
                'descripcion',
                'url',
                'map'
            ]
        });
        return Registro;
    } catch (error) {
        // Manejar errores de consulta
        console.error('Error en la consulta:', error);
        throw error;
    }
};


const sendAndUpdatePaisaje = async (
    pais,
    zona,
    descripcion,
    urlWiki,
    urlImagen,
    idPaisaje,
    map
) => {
    try {
        // Obtener el registro existente de la base de datos
        const existingRegister = await Paisajes.findOne({
            where: {
                id: idPaisaje,
            },
        })

        if (!existingRegister) {
            throw new Error("El Registro con ID especificado no existe.");
        }
        // Verificar si los nuevos valores son diferentes de los actuales antes de actualizar
        if (
            descripcion !== existingRegister.descripcion ||
            urlWiki !== existingRegister.url ||
            pais.id !== existingRegister.paises_id_pais ||
            zona.id !== existingRegister.zonas_id_zona ||
            map !== existingRegister.map
        ) {
            // Actualizar el registro existente en la tabla "aves" y sus relaciones
            await Paisajes.update(
                {
                    descripcion: descripcion,
                    url: urlWiki,
                    paises_id_pais: pais.id,
                    zonas_id_zona: zona.id,
                    map: map
                },
                {
                    where: {
                        id: idPaisaje
                    },
                }
            );
        }
        for (const imageUrl of urlImagen) {
            await Imagenes_paisajes.create({
                paisajes_id_paisaje: idPaisaje,
                url_paisaje: imageUrl,
            });
        }
        return "El Registro se ha actualizado correctamente.";
    } catch (error) {
        console.log('Error:', error);
    }
};

const findPhotosIdPaisaje = async (imgsIds) => {
    try {
        await Imagenes_paisajes.destroy({ where: { id: imgsIds } });
        return 'Las fotografías se han borrado exitosamente'
    } catch (error) {
        console.error('Error al buscar fotos por ID Paisaje:', error);
        throw error;
    }
};

const setDbCoverPaisaje = async (idFoto, idPaisaje) => {
    // console.log('datos controles portada:', idFoto, idPaisaje)
    try {
        // Buscar todas las imágenes asociadas al 
        const imagenes = await Imagenes_paisajes.findAll({ where: { paisajes_id_paisaje: idPaisaje } });
        // Encontrar la imagen destacada actual, si la hay
        const imagenDestacadaActual = imagenes.find((imagen) => imagen.destacada === true);
        // Desmarcar la imagen destacada actual, si la hay
        if (imagenDestacadaActual) {
            await imagenDestacadaActual.update({ destacada: null });
        }
        // Marcar la nueva imagen como destacada
        const imagenNuevaDestacada = await Imagenes_paisajes.findByPk(idFoto);
        if (imagenNuevaDestacada) {
            await imagenNuevaDestacada.update({ destacada: true });
            return 'La fotografía se ha destacado exitosamente';
        } else {
            return 'No se encontró la fotografía con el ID proporcionado';
        }
    } catch (error) {
        console.error('Error al buscar o actualizar la foto por ID de ave:', error);
        throw error;
    }
};


const deleteRegisterDb = async (id) => {
    // console.log(id)
    try {
        const imagenes = await Imagenes_paisajes.findAll({
            where: {
                paisajes_id_paisaje: id,
            },
        });
        // console.log(imagenesAves)
        const ftpDeleteResults = await deletePhotoFromFTPPaisajes(imagenes.map(imagen => imagen.url_paisaje));

        if (!ftpDeleteResults.success) {
            // Si hay un problema al borrar las fotos del FTP, puedes manejar el error aquí
            throw new Error("Error al borrar las fotos del FTP.");
        }

        // Buscar imágenes en la base de datos después de eliminarlas del FTP
        const remainingImages = await Imagenes_paisajes.findAll({
            where: {
                paisajes_id_paisaje: id,
            },
        });

        // Eliminar las imágenes de la base de datos si aún existen
        await Promise.all(remainingImages.map(async (imagen) => {
            await imagen.destroy();
        }));


        // Eliminar las relaciones y la ave
        const existingRelations = await Paisajes.findByPk(id);
        if (!existingRelations) {
            throw new Error("El Registro con el ID especificado no existe.");
        }

        // await existingRelations.setPaises([]);
        // await existingRelations.setZonasAves([]);
        // await existingRelations.setImagenes_paisajes([]);

        // Finalmente, destruir la ave
        await existingRelations.destroy();

        return "Paisaje eliminada correctamente junto con sus relaciones.";
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const findNameDuplicateP = async (id) => {
    try {
        const existingRelations = await Paisajes.findAll({
            where: {
                zonas_id_zona: id
            }
        });

        // Si encuentra aves con el mismo nombre, arroja un error
        if (existingRelations.length > 0) {
            throw new Error("Este Registro ya existe.");
        }
        // Si no encuentra aves con el mismo nombre, simplemente retorna
        return "Registro disponible.";

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const findNameDuplicatePP = async (id) => {
    try {
        const existingRelations = await Paisajes.findAll({
            where: {
                paises_id_pais: id
            }
        });

        // Si encuentra aves con el mismo nombre, arroja un error
        if (existingRelations.length > 0) {
            throw new Error("Este Registro ya existe.");
        }
        // Si no encuentra aves con el mismo nombre, simplemente retorna
        return "Registro disponible.";

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};



module.exports = {
    fetchOptionsLand,
    fetchFilterLands,
    sendAndCreateLand,
    findDataByIdP,
    sendAndUpdatePaisaje,
    findPhotosIdPaisaje,
    setDbCoverPaisaje,
    filterOptionsPaisZonasPaisaje,
    deleteRegisterDb,
    findDataByNameP,
    findNameDuplicateP,
    findNameDuplicatePP
};
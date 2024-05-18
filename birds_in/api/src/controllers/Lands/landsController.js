const { Op, Sequelize } = require("sequelize");
const { Aves, Grupos, Familias, Paises, Imagenes_aves, Zonas, Paisajes, Imagenes_paisajes } = require('../../db/db');
const mapFieldValues = require('../../utils/mapOptions');
const { obtenerIdDePais, obtenerIdDeZonas } = require("../../utils/OptionsZonaPais");
const deletePhotoFromFTP = require("../../utils/deletFtp");

const DEFAULT_PER_PAGE = 18;
const DEFAULT_PAGE = 1;
const fetchFilterLands = async (
    descripcion,
    pais,
    zonas,
    page,
    perPage
) => {
    try {
        if (descripcion) {
            descripcion = decodeURIComponent(descripcion);
        }
        const whereClause = {};
        if (descripcion) {
            whereClause.descripcion = { [Op.like]: `%${descripcion}%` };
        }

        const includeArr = [
            {
                model: Paises,
                attributes: ['nombre', 'id_pais'],
                as: 'paise'
            },
            {
                model: Zonas,
                attributes: [
                    ['nombre_zona', 'nombre'],
                    'id_zona'],
                as: 'zona'
            },
            {
                model: Imagenes_paisajes,
                attributes: [
                    ['url_paisaje', 'url'],
                    'destacada',]
            }
        ];

        if (pais) {
            includeArr.push({
                model: Paises,
                attributes: ['nombre', 'id_pais'],
                as: 'paise',
                where: { id_pais: pais }
            });
        }

        if (zonas) {
            includeArr.push({
                model: Zonas,
                attributes: ['nombre', 'id_zona'],
                as: 'zona',
                where: { id_zona: zonas }
            });
        }

        const pageConvert = Number(page) || DEFAULT_PAGE;
        const perPageConvert = perPage === '0' ? undefined : Number(perPage) || DEFAULT_PER_PAGE;
        const offset = perPageConvert ? (pageConvert - 1) * perPageConvert : 0;
        const RegistrosFiltrados = await Paisajes.findAll({
            where: whereClause,
            include: includeArr,
            limit: perPageConvert,
            offset: offset,
        });

        const totalResultsClausula = await Paisajes.count({ where: whereClause });
        const totalResults = RegistrosFiltrados.length
        const totalPages = Math.ceil(totalResultsClausula / perPageConvert); // Calcular el total de páginas
        const isLastPage = totalResults <= 8 || pageConvert >= totalPages; // Verificar si estás en la última página
        return { RegistrosFiltrados, totalResultsClausula, isLastPage };
    } catch (error) {
        console.error('Ocurrió un error al realizar la consulta:', error);
        throw error; // Lanza la excepción para que pueda ser capturada en el lugar desde donde se llama la función.
    }
};

const fetchOptions = async () => {
    const optionsGrupos = await Grupos.findAll({
        attributes: ['nombre', ['id_grupo', 'id']],
    });
    const optionsFamilias = await Familias.findAll({
        attributes: ['nombre', ['id_familia', 'id']]
    })
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
    const optionsNames = await Aves.findAll({
        attributes: ['nombre_cientifico', 'nombre_ingles',]
    })
    // const nombresGrupos = mapFieldValues(optionsGrupos, 'nombre', 'id_grupo')
    // const nombreFamilias = mapFieldValues(optionsFamilias, 'nombre', 'id_familia')
    // const nombrePaises = mapFieldValues(optionsPaises, 'nombre', 'id_pais')
    const nombreIngles = mapFieldValues(optionsNames, 'nombre_ingles')
    const nombreCientifico = mapFieldValues(optionsNames, 'nombre_cientifico')
    // const nombrezonas = mapFieldValues(optionsZonas, 'nombre_zona', 'id_zona')

    return {
        grupos: optionsGrupos,
        familias: optionsFamilias,
        paises: optionsPaises,
        nIngles: nombreIngles,
        nCientifico: nombreCientifico,
        zonas: optionsZonas
    }
};

const filterOptions = async (grupo, familia, pais, nombreIngles, nombreCientifico, zonas) => {
    const perpage = '0'
    const page = '0'
    const allResults = await fetchFilterBirds(
        grupo,
        familia,
        pais,
        nombreIngles,
        nombreCientifico,
        zonas,
        page,
        perpage)

    const newOptions = {
        grupos: [],
        familias: [],
        paises: [],
        zonas: [],
        nIngles: [],
        nCientifico: [],
    };

    const gruposSet = new Set();
    allResults.avesFiltradas.forEach(ave => {
        gruposSet.add(JSON.stringify({
            id: ave.dataValues.grupos_id_grupo,
            nombre: ave.grupo.dataValues.nombre
        }));
    });
    const gruposArray = Array.from(gruposSet).map(grupo => JSON.parse(grupo));
    newOptions.grupos = gruposArray
    const familiasSet = new Set();
    allResults.avesFiltradas.forEach(ave => {
        familiasSet.add(JSON.stringify({
            id: ave.dataValues.familias_id_familia,
            nombre: ave.familia.dataValues.nombre
        }));
    });
    const familiasArray = Array.from(familiasSet).map(item => JSON.parse(item));
    newOptions.familias = familiasArray;

    const paisesSet = new Set();
    allResults.avesFiltradas.forEach(ave => {
        ave.paises.forEach(pais => paisesSet.add(JSON.stringify({
            id: pais.dataValues.id_pais,
            nombre: pais.dataValues.nombre
        })));
    });
    newOptions.paises = Array.from(paisesSet).map(pais =>
        JSON.parse(pais));

    const zonasSet = new Set();
    allResults.avesFiltradas.forEach(ave => {
        ave.zonasAves.forEach(zona => zonasSet.add(JSON.stringify({
            id: zona.dataValues.id_zona,
            nombre: zona.dataValues.nombre
        })));
    });
    newOptions.zonas = Array.from(zonasSet).map(zona =>
        JSON.parse(zona));
    const nombresCientificos = [...new Set(allResults.avesFiltradas.map(ave => ({ id: ave.id_ave, nombre: ave.dataValues.nombre_cientifico })))];
    newOptions.nCientifico = nombresCientificos;
    const nombresIngles = [...new Set(allResults.avesFiltradas.map(ave => ({ id: ave.id_ave, nombre: ave.dataValues.nombre_ingles })))];
    newOptions.nIngles = nombresIngles;
    // const listaZona = [...new Set(allResults.map(ave => ({ id: ave.id_ave, nombre: ave.dataValues.zonas })))];
    // newOptions.zonas = listaZona;
    return newOptions;
};

const filterOptionsPaisZonas = async (familia,
    grupo,
    nombreCientifico,
    nombreIngles,
    pais,
    zonas,
) => {

    const perpage = '0'
    const page = '0'
    const allResults = await fetchFilterBirds(
        familia,
        grupo,
        nombreCientifico,
        nombreIngles,
        pais,
        zonas,
        page,
        perpage)

    const newOptions = {
        grupos: [],
        familias: [],
        paises: [],
        zonas: [],
        nIngles: [],
        nCientifico: [],
    };

    // Verificar si se proporcionó un ID de zona o un ID de país

    if (zonas || pais) {

        const paisNumb = parseInt(pais)
        // Filtrar las aves según el país y las zonas proporcionadas
        allResults.avesFiltradas = allResults.avesFiltradas.filter(ave => {
            const meetsPaisCriteria = !pais || ave.paises.some(paisAve => paisAve.dataValues.id_pais === paisNumb);
            const meetsZonasCriteria = !zonas || ave.zonasAves.some(zona => zonas.includes(zona.dataValues.id_zona));
            return meetsPaisCriteria && meetsZonasCriteria;
        });
    }
    // Lógica para construir las opciones de paises y zonas
    if (zonas) {
        // Construir opciones de países basadas en las aves filtradas
        const paisesSet = new Set();
        allResults.avesFiltradas.forEach(ave => {
            ave.paises.forEach(pais =>
                paisesSet.add(JSON.stringify({
                    id: pais.dataValues.id_pais,
                    nombre: pais.dataValues.nombre,
                })));
        });

        const findIdPais = await obtenerIdDePais(zonas)

        const newopti = Array.from(paisesSet).filter(pais => findIdPais.includes(JSON.parse(pais).id));

        newOptions.paises = [JSON.parse(newopti)];

        const zonasSet = new Set();
        allResults.avesFiltradas.forEach(ave => {
            ave.zonasAves.forEach(zona => zonasSet.add(JSON.stringify({
                id: zona.dataValues.id_zona,
                nombre: zona.dataValues.nombre
            })));
        });
        newOptions.zonas = Array.from(zonasSet).map(zona =>
            JSON.parse(zona));
    }
    if (pais) {
        // console.log(allResults.avesFiltradas)
        // console.log('entro en pais');
        // Construir opciones de zonas basadas en las aves filtradas
        const zonasSet = new Set();
        allResults.avesFiltradas.forEach(ave => {
            ave.zonasAves.forEach(zona =>
                zonasSet.add(JSON.stringify({
                    id: zona.dataValues.id_zona,
                    nombre: zona.dataValues.nombre,
                })));
        });

        // console.log(zonasSet);
        const findIdZonas = await obtenerIdDeZonas(pais);
        // console.log(findIdZonas);
        const newOptionsZona = Array.from(zonasSet).filter(zona => findIdZonas.includes(JSON.parse(zona).id));

        // Transformar el formato de newOptionsZona
        const transformedOptionsZona = newOptionsZona.map(option => ({
            id: JSON.parse(option).id,
            nombre: JSON.parse(option).nombre,
        }));
        // console.log(transformedOptionsZona)
        newOptions.zonas = transformedOptionsZona
        // console.log(newOptions.zonas);

        const paisSet = new Set();
        allResults.avesFiltradas.forEach(ave => {
            ave.paises.forEach(zona => paisSet.add(JSON.stringify({
                id: zona.dataValues.id_pais,
                nombre: zona.dataValues.nombre
            })));
        });
        // console.log(paisSet)
        newOptions.paises = Array.from(paisSet).map(pa => JSON.parse(pa))
    }
    const gruposSet = new Set();
    allResults.avesFiltradas.forEach(ave => {
        gruposSet.add(JSON.stringify({
            id: ave.dataValues.grupos_id_grupo,
            nombre: ave.grupo.dataValues.nombre
        }));
    });
    const gruposArray = Array.from(gruposSet).map(grupo => JSON.parse(grupo));
    newOptions.grupos = gruposArray
    const familiasSet = new Set();
    allResults.avesFiltradas.forEach(ave => {
        familiasSet.add(JSON.stringify({
            id: ave.dataValues.familias_id_familia,
            nombre: ave.familia.dataValues.nombre
        }));
    });
    const familiasArray = Array.from(familiasSet).map(item => JSON.parse(item));
    newOptions.familias = familiasArray;

    const nombresCientificos = [...new Set(allResults.avesFiltradas.map(ave => ({ id: ave.id_ave, nombre: ave.dataValues.nombre_cientifico })))];
    newOptions.nCientifico = nombresCientificos;
    const nombresIngles = [...new Set(allResults.avesFiltradas.map(ave => ({ id: ave.id_ave, nombre: ave.dataValues.nombre_ingles })))];
    newOptions.nIngles = nombresIngles;
    // const listaZona = [...new Set(allResults.map(ave => ({ id: ave.id_ave, nombre: ave.dataValues.zonas })))];
    // newOptions.zonas = listaZona;
    return newOptions;
};

const sendAndCreateLand = async (
    pais,
    zona,
    descripcion,
    urlImagen
) => {

    try {
        // Verificar si tanto el país como la zona están presentes
        if (!pais || !zona) {
            throw new Error('Tanto el país como la zona son obligatorios.');
        }

        // Aplicar conversiones solo si la descripción está presente
        const converDescripcion = descripcion ? descripcion.charAt(0).toUpperCase() + descripcion.slice(1).toLowerCase() : null;

        const imagenesData = urlImagen.map((imageUrl) => {
            return {
                url_paisaje: imageUrl,
            };
        });

        // Crear un nuevo registro en la tabla "Paisajes"
        const createNewRegistro = await Paisajes.create({
            descripcion: converDescripcion,
            paises_id_pais: pais.id,
            zonas_id_zona: zona.id,
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
            zona.id !== existingRegister.zonas_id_zona
        ) {
            // Actualizar el registro existente en la tabla "aves" y sus relaciones
            await Paisajes.update(
                {
                    descripcion: descripcion,
                    url: urlWiki,
                    paises_id_pais: pais.id,
                    zonas_id_zona: zona.id,
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
        console.error('Error al buscar fotos por ID de ave:', error);
        throw error;
    }
};

const setDbCoverPaisaje = async (idFoto, idPaisaje) => {
    console.log('datos controles portada:', idFoto, idPaisaje)
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

const getContadores = async () => {
    try {
        const allBirds = await Aves.count();
        const allEnglish = await Aves.count({
            where: {
                nombre_ingles: {
                    [Sequelize.Op.not]: null, // El nombre en inglés no es nulo
                    [Sequelize.Op.not]: ''    // El nombre en inglés no está vacío
                }
            }
        });
        const allCientifico = await Aves.count({
            where: {
                nombre_cientifico: {
                    [Sequelize.Op.not]: null, // El nombre en inglés no es nulo
                    [Sequelize.Op.not]: ''    // El nombre en inglés no está vacío
                }
            }
        });
        const allComun = await Aves.count({
            where: {
                nombre_comun: {
                    [Sequelize.Op.not]: null, // El nombre en inglés no es nulo
                    [Sequelize.Op.not]: ''    // El nombre en inglés no está vacío
                }
            }
        });
        const withoutContry = await Aves.count({
            where: {
                [Sequelize.Op.not]: Sequelize.literal('EXISTS (SELECT 1 FROM aves_has_paises WHERE aves.id_ave = aves_has_paises.aves_id_ave)'),
            },
        })
        const allCountrys = await Paises.count({
            distinct: true,
            col: 'id_pais', // Ajusta según el nombre real de la columna en tu modelo
            include: [{
                model: Aves,
                through: 'aves_has_paises',
                attributes: [], // Evita recuperar todos los atributos de la relación
                required: true, // Utiliza una inner join para asegurar que solo obtengas registros que tengan relaciones en aves_has_paises
            }],
        });

        const allGrupos = await Grupos.count();
        const allFamilias = await Familias.count()
        const allZonas = await Zonas.count()


        return { allBirds, allEnglish, allCientifico, allComun, allGrupos, allFamilias, allZonas, allCountrys }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const deleteBirdDb = async (idAve) => {
    try {
        const imagenesAves = await Imagenes_aves.findAll({
            where: {
                aves_id_ave: idAve,
            },
        });

        const ftpDeleteResults = await deletePhotoFromFTP(imagenesAves.map(imagen => imagen.url));

        if (!ftpDeleteResults.success) {
            // Si hay un problema al borrar las fotos del FTP, puedes manejar el error aquí
            throw new Error("Error al borrar las fotos del FTP.");
        }

        // Buscar imágenes en la base de datos después de eliminarlas del FTP
        const remainingImages = await Imagenes_aves.findAll({
            where: {
                aves_id_ave: idAve,
            },
        });

        // Eliminar las imágenes de la base de datos si aún existen
        await Promise.all(remainingImages.map(async (imagen) => {
            await imagen.destroy();
        }));


        // Eliminar las relaciones y la ave
        const existingRelations = await Aves.findByPk(idAve);
        if (!existingRelations) {
            throw new Error("La ave con el ID especificado no existe.");
        }

        await existingRelations.setPaises([]);
        await existingRelations.setZonasAves([]);
        await existingRelations.setImagenes_aves([]);

        // Finalmente, destruir la ave
        await existingRelations.destroy();

        return "Ave eliminada correctamente junto con sus relaciones.";
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


module.exports = {
    fetchOptions,
    filterOptions,
    fetchFilterLands,
    sendAndCreateLand,
    findDataByIdP,
    sendAndUpdatePaisaje,
    findPhotosIdPaisaje,
    setDbCoverPaisaje,
    getContadores,
    filterOptionsPaisZonas,
    deleteBirdDb,
    findDataByNameP,
    findNameDuplicateP
};
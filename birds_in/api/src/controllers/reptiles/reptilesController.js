const { Op, Sequelize } = require("sequelize");
const { Reptiles, Order_reptiles, Grupos_reptiles, Familias_reptiles, Paises, Imagenes_reptiles, Zonas, } = require('../../config/db/db');
const mapFieldValues = require('../../utils/mapOptions');
const { obtenerIdDePais, obtenerIdDeZonas } = require("../../utils/OptionsZonaPais");
const { deletePhotoFromFTPReptiles } = require("../../services/deletFtp");

const DEFAULT_PER_PAGE = 18;
const DEFAULT_PAGE = 1;

const decodeQueryParam = (param) => {
    return param ? decodeURIComponent(param) : null;
};

const buildWhereClause = (familia, grupo, nombreCientifico, nombreIngles) => {
    const whereClause = {};
    if (familia) {
        whereClause.familias_id_familia = familia;
    }

    if (grupo) {
        const grupoArray = grupo.split(',').map(Number);
        whereClause.grupos_id_grupo = { [Op.in]: grupoArray };
    }
    if (nombreCientifico) {
        whereClause.nombre_cientifico = nombreCientifico;
    }
    if (nombreIngles) {
        whereClause.nombre_ingles = nombreIngles;
    }
    // if (nombreCientifico) {
    //     whereClause.nombre_cientifico = { [Op.like]: `%${nombreCientifico}%` };
    // }
    // if (nombreIngles) {
    //     whereClause.nombre_ingles = { [Op.like]: `%${nombreIngles}%` };
    // }
    return whereClause;
};

const buildIncludeArray = (pais, zonas) => {
    return [
        { model: Grupos_reptiles, attributes: ['nombre'] },
        { model: Familias_reptiles, attributes: ['nombre'] },
        buildIncludeForPais(pais),
        buildIncludeForZonas(zonas),

        {
            model: Imagenes_reptiles,
            as: 'imagenes_reptiles',
            attributes: [['url_reptil', 'url',], 'destacada', 'orden_imagenes'],
            order: [['orden_imagenes', 'ASC']],
            separate: true
        },

    ];
};

const buildIncludeForPais = (pais) => {
    return {
        model: Paises,
        attributes: ['nombre', 'id_pais'],
        through: {
            attributes: [],
        },
        ...(pais && {
            where: { id_pais: pais },
            required: true
        })
    };
};

const buildIncludeForZonas = (zonas) => {
    return {
        model: Zonas,
        as: 'zonasReptiles',
        attributes: ['nombre_zona', 'id_zona'],
        through: {
            attributes: [],
        },
        ...(zonas && {
            where: { id_zona: zonas },
            required: true
        })
    };
};

const fetchFilterRegister = async (
    familia,
    grupo,
    pais,
    zonas,
    nombreCientifico,
    nombreIngles,
    page, perPage
) => {
    // console.log( familia, grupo, pais, zonas, nombreCientifico, nombreIngles)
    try {
        nombreCientifico = decodeQueryParam(nombreCientifico);
        nombreIngles = decodeQueryParam(nombreIngles);

        const whereClause = buildWhereClause(familia, grupo, nombreCientifico, nombreIngles);
        let includeArr = buildIncludeArray(pais, zonas);


        const pageConvert = Number(page) || DEFAULT_PAGE;
        const perPageConvert = perPage === '0' ? undefined : Number(perPage) || DEFAULT_PER_PAGE;
        const offset = perPageConvert ? (pageConvert - 1) * perPageConvert : 0;

        const registrosFiltrados = await Reptiles.findAll({
            where: whereClause,
            include: includeArr,
            limit: perPageConvert,
            offset: offset,
            order: [['nombre_ingles', 'ASC']],
        });


        const totalResultsCount = await Reptiles.count({
            where: whereClause,
            include: buildIncludeArray(pais, zonas),
            distinct: true
        });


        const totalPages = Math.ceil(totalResultsCount / perPageConvert);
        const isLastPage = totalResultsCount <= 8 || pageConvert >= totalPages;

        return { registrosFiltrados, totalResultsCount, isLastPage };
    } catch (error) {
        console.error('Ocurrió un error al realizar la consulta:', error);
        throw new Error('Error al realizar la consulta de Reptiles');
    }
};


const fetchOptions = async () => {

    const optionsGrupos = await Grupos_reptiles.findAll({
        attributes: ['nombre', ['id_grupo', 'id']],
        order: [['nombre', 'ASC']]
    });
    const optionsFamilias = await Familias_reptiles.findAll({
        attributes: ['nombre', ['id_familia', 'id']],
        order: [['nombre', 'ASC']]
    })
    const optionsPaises = await Paises.findAll({
        attributes: [['id_pais', 'id'], 'nombre',],
        order: [['nombre', 'ASC']]
    });
    const optionsZonas = await Zonas.findAll({
        attributes: [['id_zona', 'id'], ['nombre_zona', 'nombre'],
        [
            Sequelize.literal('(SELECT nombre FROM paises WHERE paises.id_pais = id_paises)'),
            'nombre_pais'
        ],
        ],
        order: [
            ['nombre_zona', 'ASC']
        ]
    });
    const optionsNames = await Reptiles.findAll({
        attributes: ['nombre_cientifico', 'nombre_ingles',],
        order: [
            ['nombre_cientifico', 'ASC'], // Ordenar nombres científicos alfabéticamente
            ['nombre_ingles', 'ASC'] // Ordenar nombres ingleses alfabéticamente
        ]
    })
    // const nombresGrupos = mapFieldValues(optionsGrupos, 'nombre', 'id_grupo')
    // const nombreFamilias = mapFieldValues(optionsFamilias, 'nombre', 'id_familia')
    // const nombrePaises = mapFieldValues(optionsPaises, 'nombre', 'id_pais')
    const nombreIngles = mapFieldValues(optionsNames, 'nombre_ingles');
    const nombreCientifico = mapFieldValues(optionsNames, 'nombre_cientifico');
    // const nombrezonas = mapFieldValues(optionsZonas, 'nombre_zona', 'id_zona')

    return {
        familias: optionsFamilias,
        grupos: optionsGrupos,
        paises: optionsPaises,
        nIngles: nombreIngles,
        nCientifico: nombreCientifico,
        zonas: optionsZonas
    }
};

const filterOptions = async (
    familia,
    grupo,
    pais,
    zonas,
    nombreCientifico,
    nombreIngles,
) => {
    const perpage = '0';
    const page = '0';
    const allResults = await fetchFilterRegister(
        familia,
        grupo,
        pais,
        zonas,
        nombreCientifico,
        nombreIngles,
        page,
        perpage
    );

    const newOptions = {
        familias: [],
        grupos: [],
        paises: [],
        zonas: [],
        nIngles: [],
        nCientifico: [],
    };


    const gruposSet = new Set();
    allResults.registrosFiltrados.forEach(registro => {
        if (registro.dataValues && registro.grupos_reptile && registro.grupos_reptile.dataValues) {
            gruposSet.add(JSON.stringify({
                id: registro.dataValues.grupos_id_grupo,
                nombre: registro.grupos_reptile.dataValues.nombre
            }));
        }
    });
    newOptions.grupos = Array.from(gruposSet).map(grupo => JSON.parse(grupo));

    const familiasSet = new Set();
    allResults.registrosFiltrados.forEach(registro => {
        if (registro.dataValues && registro.familias_reptile && registro.familias_reptile.dataValues) {
            familiasSet.add(JSON.stringify({
                id: registro.dataValues.familias_id_familia,
                nombre: registro.familias_reptile.dataValues.nombre
            }));
        }
    });
    newOptions.familias = Array.from(familiasSet).map(item => JSON.parse(item));

    const paisesSet = new Set();
    allResults.registrosFiltrados.forEach(registro => {
        if (registro.paises && Array.isArray(registro.paises)) {
            registro.paises.forEach(pais => {
                if (pais.dataValues) {
                    paisesSet.add(JSON.stringify({
                        id: pais.dataValues.id_pais,
                        nombre: pais.dataValues.nombre
                    }));
                }
            });
        }
    });
    newOptions.paises = Array.from(paisesSet).map(pais => JSON.parse(pais));

    const zonasSet = new Set();
    allResults.registrosFiltrados.forEach(registro => {
        if (registro.zonasReptiles && Array.isArray(registro.zonasReptiles)) {
            registro.zonasReptiles.forEach(zona => {
                if (zona.dataValues) {
                    zonasSet.add(JSON.stringify({
                        id: zona.dataValues.id_zona,
                        nombre: zona.dataValues.nombre
                    }));
                }
            });
        }
    });
    newOptions.zonas = Array.from(zonasSet).map(zona => JSON.parse(zona));

    const nombresCientificos = [...new Set(allResults.registrosFiltrados.map(registro => ({
        id: registro.id_reptil,
        nombre: registro.dataValues ? registro.dataValues.nombre_cientifico : null
    })))];
    newOptions.nCientifico = nombresCientificos;

    const nombresIngles = [...new Set(allResults.registrosFiltrados.map(registro => ({
        id: registro.id_reptil,
        nombre: registro.dataValues ? registro.dataValues.nombre_ingles : null
    })))];
    newOptions.nIngles = nombresIngles;

    return newOptions;
};


const filterOptionsPaisZonas = async (
    familia,
    grupo,
    pais,
    zonas,
    nombreCientifico,
    nombreIngles,
) => {
    const perpage = '0';
    const page = '0';
    const allResults = await fetchFilterRegister(
        familia,
        grupo,
        pais,
        zonas,
        nombreCientifico,
        nombreIngles,
        page,
        perpage
    );

    const newOptions = {
        familias: [],
        grupos: [],
        paises: [],
        zonas: [],
        nIngles: [],
        nCientifico: [],
    };
    if (!allResults?.registrosFiltrados) {
        return newOptions; // Retornar vacío si no hay datos
    }
    // Verificar si se proporcionó un ID de zona o un ID de país
    if (zonas || pais) {
        const paisNumb = parseInt(pais);

        // Filtrar las Reptiles según el país y las zonas proporcionadas
        allResults.registrosFiltrados = allResults.registrosFiltrados.filter(registro => {
            const meetsPaisCriteria = !pais || registro.paises?.some(pais => pais?.dataValues?.id_pais === paisNumb);
            const meetsZonasCriteria = !zonas || registro.zonasReptiles?.some(zona => zonas.includes(zona?.dataValues?.id_zona));
            return meetsPaisCriteria && meetsZonasCriteria;
        });
    }

    // Lógica para construir las opciones de países y zonas
    if (zonas) {
        // Construir opciones de países basadas en las Reptiles filtradas
        const paisesSet = new Set();
        allResults.registrosFiltrados.forEach(registro => {
            registro.paises?.forEach(pais => {
                if (pais?.dataValues) {
                    paisesSet.add(JSON.stringify({
                        id: pais.dataValues.id_pais,
                        nombre: pais.dataValues.nombre,
                    }));
                }
            });
        });

        const findIdPais = await obtenerIdDePais(zonas);
        const newopti = Array.from(paisesSet).filter(pais => findIdPais.includes(JSON.parse(pais).id));
        newOptions.paises = newopti.map(JSON.parse).sort((a, b) => a.nombre.localeCompare(b.nombre));
        // newOptions.paises = newopti.map(pais => JSON.parse(pais));

        const zonasSet = new Set();
        allResults.registrosFiltrados.forEach(registro => {
            registro.zonasReptiles?.forEach(zona => {
                if (zona?.dataValues) {
                    zonasSet.add(JSON.stringify({
                        id: zona.dataValues.id_zona,
                        nombre: zona.dataValues.nombre
                    }));
                }
            });
        });
        newOptions.zonas = Array.from(zonasSet).map(zona => JSON.parse(zona));
    }

    if (pais) {
        // Construir opciones de zonas basadas en las Reptiles filtradas
        const zonasSet = new Set();
        allResults.registrosFiltrados.forEach(registro => {
            registro.zonasReptiles?.forEach(zona => {
                if (zona?.dataValues) {
                    zonasSet.add(JSON.stringify({
                        id: zona.dataValues.id_zona,
                        nombre: zona.dataValues.nombre,
                    }));
                }
            });
        });

        const findIdZonas = await obtenerIdDeZonas(pais);
        const newOptionsZona = Array.from(zonasSet).filter(zona => findIdZonas.includes(JSON.parse(zona).id));

        newOptions.zonas = newOptionsZona.map(JSON.parse).sort((a, b) => a.nombre.localeCompare(b.nombre));

        // newOptions.zonas = newOptionsZona.map(option => ({
        //     id: JSON.parse(option).id,
        //     nombre: JSON.parse(option).nombre,
        // }));

        const paisSet = new Set();
        allResults.registrosFiltrados.forEach(registro => {
            registro.paises?.forEach(pais => {
                if (pais?.dataValues) {
                    paisSet.add(JSON.stringify({
                        id: pais.dataValues.id_pais,
                        nombre: pais.dataValues.nombre
                    }));
                }
            });
        });
        newOptions.paises = Array.from(paisSet).map(JSON.parse).sort((a, b) => a.nombre.localeCompare(b.nombre));
        // newOptions.paises = Array.from(paisSet).map(pa => JSON.parse(pa));
    }

    // Construir opciones de grupos
    const gruposSet = new Set();
    allResults.registrosFiltrados.forEach(registro => {
        if (registro.grupo?.dataValues) {
            gruposSet.add(JSON.stringify({
                id: registro.dataValues.grupos_id_grupo,
                nombre: registro.grupo.dataValues.nombre
            }));
        }
    });
    newOptions.grupos = Array.from(gruposSet).map(JSON.parse).sort((a, b) => a.nombre.localeCompare(b.nombre));
    // newOptions.grupos = Array.from(gruposSet).map(grupo => JSON.parse(grupo));

    // Construir opciones de familias
    const familiasSet = new Set();
    allResults.registrosFiltrados.forEach(registro => {
        if (registro.familia?.dataValues) {
            familiasSet.add(JSON.stringify({
                id: registro.dataValues.familias_id_familia,
                nombre: registro.familia.dataValues.nombre
            }));
        }
    });
    newOptions.familias = Array.from(familiasSet).map(JSON.parse).sort((a, b) => a.nombre.localeCompare(b.nombre));
    // newOptions.familias = Array.from(familiasSet).map(item => JSON.parse(item));

    // Construir opciones de nombres científicos
    newOptions.nCientifico = [...new Set(
        allResults.registrosFiltrados.map(registro => ({
            id: registro.id_reptil,
            nombre: registro.dataValues?.nombre_cientifico || '',
        }))
    )].sort((a, b) => a.nombre.localeCompare(b.nombre));

    // Construir opciones de nombres en inglés
    newOptions.nIngles = [...new Set(
        allResults.registrosFiltrados.map(registro => ({
            id: registro.id_reptil,
            nombre: registro.dataValues?.nombre_ingles || '',
        }))
    )].sort((a, b) => a.nombre.localeCompare(b.nombre));


    return newOptions;
};

const sendAndCreateRegister = async (
    familia,
    grupo,
    paises,
    zona,
    cientifico,
    ingles,
    comun,
    urlWiki,
    urlImagen
) => {
     console.log('imagen llega controler-->', urlImagen)
    try {
        // Verificar si el nombre en inglés está presente (obligatorio)
        if (!ingles) {
            throw new Error('El nombre en inglés es obligatorio.');
        }
        // Aplicar conversiones solo si los datos opcionales están presentes
        const convertCientifico = cientifico ? cientifico.charAt(0).toUpperCase() + cientifico.slice(1).toLowerCase() : null;
        const convertComun = comun ? comun.charAt(0).toUpperCase() + comun.slice(1).toLowerCase() : null;
        // const imagenesRegistrosData = urlImagen.map((imageUrl) => {
        //     return {
        //         url_reptil: imageUrl,
        //     };
        // });
        // Crear arreglo de imágenes con orden definido manualmente
        const imagenesRegistrosData = urlImagen?.length
            ? urlImagen.map((imageUrl, index) => ({
                url_reptil: imageUrl,
                orden_imagen: index + 1
            }))
            : [];

        // Crear un nuevo registro en la tabla "Reptiles" solo si el nombre en inglés está presente
        const createNew = await Reptiles.create({
            nombre_ingles: ingles,
            nombre_cientifico: convertCientifico,
            nombre_comun: convertComun,
            url_wiki: urlWiki,
            familias_id_familia: familia.id,
            grupos_id_grupo: grupo.id,
            imagenes_reptiles: imagenesRegistrosData
        }, {
            include: Imagenes_reptiles,
        });

        for (const pais of paises) {
            await createNew.addPaises(pais.id);
        }
        for (const zonas of zona) {
            await createNew.addZonasReptiles(zonas.id);
        }
        // Busca el registro recién creada por el nombre en inglés
        const createdRegistro = await Reptiles.findOne({
            where: {
                nombre_ingles: ingles
            },
        });
        return { message: "El registro se ha creado correctamente.", registro: createdRegistro };
    } catch (error) {
        // Manejar específicamente el error de clave única duplicada
        if (error.name === 'SequelizeUniqueConstraintError') {
            // Ajusta el mensaje de error según tus necesidades
            throw new Error("El nombre en inglés ya existe.");
        }
        // A continuación, puedes agregar lógica para manejar otros errores específicos si es necesario.
        console.error('Error en la consulta:', error);
        throw error;
    }
};

const findDataById = async (id) => {
    try {
        const registro = await Reptiles.findOne({
            where: { id_reptil: id },
            include: [
                {
                    model: Imagenes_reptiles,
                    attributes: [['url_reptil', 'url'],
                        'id',
                        'destacada',
                        'orden_imagenes',
                    [Sequelize.literal('SUBSTRING_INDEX(url_reptil, "_", -1)'), 'titulo']
                        ,] // Atributos que deseas de Imagenes_reptiles
                },
                {
                    model: Paises,
                    attributes: ['nombre', ['id_pais', 'id']],
                    through: {
                        attributes: [],
                    }, // Atributos que deseas de Paises
                },
                {
                    model: Zonas,
                    as: 'zonasReptiles',
                    attributes: [['nombre_zona', 'nombre'], ['id_zona', 'id']],
                    through: {
                        attributes: [],
                    }, // Atributos que deseas de Paises
                },
                { model: Familias_reptiles, attributes: ['nombre', ['id_familia', 'id']] },
                { model: Grupos_reptiles, attributes: ['nombre', ['id_grupo', 'id']] },
            ],
            attributes: [
                'id_reptil',
                'nombre_ingles',
                'nombre_cientifico',
                'nombre_comun',
                'url_wiki',], // Atributos de Reptiles que deseas
            order: [[{ model: Imagenes_reptiles }, 'orden_imagenes', 'ASC']],  // Atributos de Mamiferos que deseas
        });
        // ✅ Ordenar manualmente las imágenes (por orden_imagen como número)
        if (registro && registro.imagenes_reptiles) {
            registro.imagenes_reptiles.sort((a, b) => Number(a.orden_imagen) - Number(b.orden_imagen));
        }
        return registro;
    } catch (error) {
        // Manejar errores de consulta
        console.error('Error en la consulta:', error);
        throw error;
    }
};


const findDataByName = async (name) => {
    try {
        const registro = await Reptiles.findOne({
            where: { nombre_ingles: name },
            include: [
                {
                    model: Imagenes_reptiles,
                    attributes: [
                        ['url_reptil', 'url'],
                        'id',
                        'destacada',
                        'orden_imagenes',
                        [Sequelize.literal('SUBSTRING_INDEX(url_reptil, "_", -1)'), 'titulo']
                        ,] // Atributos que deseas de Imagenes_reptiles
                },
                {
                    model: Paises,
                    attributes: ['nombre', ['id_pais', 'id']],
                    through: {
                        attributes: [],
                    }, // Atributos que deseas de Paises
                },
                {
                    model: Zonas,
                    as: 'zonasReptiles',
                    attributes: [['nombre_zona', 'nombre'], ['id_zona', 'id']],
                    through: {
                        attributes: [],
                    }, // Atributos que deseas de Paises
                },
                { model: Familias_reptiles, attributes: ['nombre', ['id_familia', 'id']] },
                { model: Grupos_reptiles, attributes: ['nombre', ['id_grupo', 'id']] },
            ],
            attributes: [
                'id_reptil',
                'nombre_ingles',
                'nombre_cientifico',
                'nombre_comun',
                'url_wiki',], // Atributos de Reptiles que deseas
            order: [[{ model: Imagenes_reptiles }, 'orden_imagenes', 'ASC']],  // Atributos de Mamiferos que deseas
        });
        // ✅ Ordenar manualmente las imágenes (por orden_imagen como número)
        if (registro && registro.imagenes_reptiles) {
            registro.imagenes_reptiles.sort((a, b) => Number(a.orden_imagen) - Number(b.orden_imagen));
        }
        return registro;
    } catch (error) {
        // Manejar errores de consulta
        console.error('Error en la consulta:', error);
        throw error;
    }
};


const sendAndUpdateRegister = async (
    familia,
    grupo,
    paises,
    zona,
    cientifico,
    ingles,
    comun,
    urlWiki,
    urlImagen,
    idRegistro,
    image_orden
) => {
    try {
        // console.log("Entró a sendAndUpdateRegister");
        // console.log('llegue par actualizar el registro CONTROLLER: ',
        //     order, '<--ORDER', familia, '<--FAMILIA', grupo, '<--GRUPO')
        // Obtener el registro existente de la base de datos
        const existingInsect = await Reptiles.findOne({
            where: {
                id_reptil: idRegistro,
            },
        });

        if (!existingInsect) {
            throw new Error("El registro con ID especificado no existe.");
        }

        // Verificar si los nuevos valores son diferentes de los actuales antes de actualizar
        const cambios = {
            nombre_ingles: ingles !== existingInsect.nombre_ingles ? ingles : undefined,
            nombre_cientifico: cientifico !== existingInsect.nombre_cientifico ? cientifico : undefined,
            nombre_comun: comun !== existingInsect.nombre_comun ? comun : undefined,
            url_wiki: urlWiki !== existingInsect.url_wiki ? urlWiki : undefined,
            familias_id_familia: familia?.id !== existingInsect.familias_id_familia ? familia?.id : undefined,
            grupos_id_grupo: grupo?.id !== existingInsect.grupos_id_grupo ? grupo?.id : undefined,

        };

        // Filtrar valores undefined
        const cambiosFiltrados = Object.fromEntries(Object.entries(cambios).filter(([key, value]) => value !== undefined));

        if (Object.keys(cambiosFiltrados).length > 0) {
            // Si nombre_ingles es diferente, hacer el cambio en dos pasos
            if (cambiosFiltrados.nombre_ingles) {
                const temporalName = `temp_${Math.random().toString(36).substring(2, 15)}`;

                await Reptiles.update(
                    { nombre_ingles: temporalName },
                    { where: { id_reptil: idRegistro } }
                );

                await Reptiles.update(
                    { nombre_ingles: ingles },
                    { where: { id_reptil: idRegistro } }
                );

                delete cambiosFiltrados.nombre_ingles;
            }

            // Actualizar el registro existente en la tabla "Reptiles" y sus relaciones
            await Reptiles.update(cambiosFiltrados, {
                where: {
                    id_reptil: idRegistro,
                },
            });
        }
        // // console.log(urlImagen)
        // for (const imageUrl of urlImagen) {
        //     await Imagenes_reptiles.create({
        //         reptiles_id_reptil: idRegistro,
        //         url_reptil: imageUrl,
        //     });
        // }
        // ✅ Obtener todas las imágenes del ave
        const existingImages = await Imagenes_reptiles.findAll({
            where: { id: idRegistro },
            order: [['orden_imagenes', 'ASC']],
        });

        // ✅ Si existen imágenes sin orden, asignarles orden secuencial
        let ordenCounter = 1;
        for (const img of existingImages) {
            if (img.orden_imagenes === null) {
                await img.update({ orden_imagenes: ordenCounter });
            }
            ordenCounter++;
        }

        // ✅ Obtener el máximo orden actual después de normalizar
        const maxOrdenImage = await Imagenes_reptiles.findOne({
            where: { id: idRegistro },
            order: [['orden_imagenes', 'DESC']],
        });

        let lastOrden = maxOrdenImage?.orden_imagenes || 0;

        // ✅ Insertar nuevas imágenes con orden siguiente
        for (const imageUrl of urlImagen) {
            lastOrden += 1;
            await Imagenes_reptiles.create({
                reptiles_id_reptil: idRegistro,
                url_reptil: imageUrl,
                orden_imagenes: lastOrden,
            });
        }

        const existingRelations = await Reptiles.findByPk(idRegistro);
        if (existingRelations) {
            // Elimina todas las relaciones de países asociadas al registro
            await existingRelations.setPaises([]);
            await existingRelations.setZonasReptiles([]);
        }

        for (const pais of paises) {
            await existingRelations.addPaises(pais.id);
        }

        for (const zonita of zona) {
            await existingRelations.addZonasReptiles(zonita.id);
        }

        return "El registro se ha actualizado correctamente.";
    } catch (error) {
        console.log('Error:', error);
        // Agrega manejo de errores específicos si es necesario.
    }
};

const findPhotosId = async (imgsIds) => {
    try {
        await Imagenes_reptiles.destroy({ where: { id: imgsIds } });
        return 'Las fotografías se han borrado exitosamente'
    } catch (error) {
        console.error('Error al buscar fotos por ID de registro:', error);
        throw error;
    }
};


const setDbCover = async (idFoto, idRegistro) => {
    try {
        // Buscar todas las imágenes asociadas al registro
        const imag = await Imagenes_reptiles.findAll({ where: { reptiles_id_reptil: idRegistro } });
        // Encontrar la imagen destacada actual, si la hay
        const imagenDestacadaActual = imag.find((imagen) => imagen.destacada === true);
        // Desmarcar la imagen destacada actual, si la hay
        if (imagenDestacadaActual) {
            await imagenDestacadaActual.update({ destacada: null });
        }
        // Marcar la nueva imagen como destacada
        const imagenNuevaDestacada = await Imagenes_reptiles.findByPk(idFoto);
        if (imagenNuevaDestacada) {
            await imagenNuevaDestacada.update({ destacada: true });
            return 'La fotografía se ha destacado exitosamente';
        } else {
            return 'No se encontró la fotografía con el ID proporcionado';
        }
    } catch (error) {
        console.error('Error al buscar o actualizar la foto por ID de registro:', error);
        throw error;
    }
};

const getContadores = async () => {
    try {
        const allRegistros = await Reptiles.count();
        const allEnglish = await Reptiles.count({
            where: {
                nombre_ingles: {
                    [Sequelize.Op.not]: null, // El nombre en inglés no es nulo
                    [Sequelize.Op.not]: ''    // El nombre en inglés no está vacío
                }
            }
        });
        const allCientifico = await Reptiles.count({
            where: {
                nombre_cientifico: {
                    [Sequelize.Op.not]: null, // El nombre en inglés no es nulo
                    [Sequelize.Op.not]: ''    // El nombre en inglés no está vacío
                }
            }
        });
        const allComun = await Reptiles.count({
            where: {
                nombre_comun: {
                    [Sequelize.Op.not]: null, // El nombre en inglés no es nulo
                    [Sequelize.Op.not]: ''    // El nombre en inglés no está vacío
                }
            }
        });

        const allCountrys = await Paises.count({
            distinct: true,
            col: 'id_pais', // Ajusta según el nombre real de la columna en tu modelo
            include: [{
                model: Reptiles,
                through: 'reptiles_has_paises',
                attributes: [], // Evita recuperar todos los atributos de la relación
                required: true, // Utiliza una inner join para asegurar que solo obtengas registros que tengan relaciones en reptiles_has_paises
            }],
        });
        const allFamilias = await Familias_reptiles.count()
        const allGrupos = await Grupos_reptiles.count();
        const allZonas = await Zonas.count({
            distinct: true,
            col: 'id_zona', // Ajusta según el nombre real de la columna en tu modelo
            include: [{
                model: Reptiles,
                through: 'reptiles_has_zonas',
                as: 'zoReptiles',
                attributes: [], // Evita recuperar todos los atributos de la relación
                required: true, // Utiliza una inner join para asegurar que solo obtengas registros que tengan relaciones en reptiles_has_paises
            }],
        })


        return { allRegistros, allEnglish, allCientifico, allComun, allFamilias, allGrupos, allZonas, allCountrys }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const deleteRegistroDb = async (idRegistro) => {
    try {
        const imagenes = await Imagenes_reptiles.findAll({
            where: {
                reptiles_id_reptil: idRegistro,
            },
        });
        // console.log(imagenes, 'soy imagenes de find all')
        const ftpDeleteResults = await deletePhotoFromFTPReptiles(imagenes.map(imagen => imagen.url_reptil));

        if (!ftpDeleteResults.success) {
            // Si hay un problema al borrar las fotos del FTP, puedes manejar el error aquí
            throw new Error("Error al borrar las fotos del FTP.");
        }

        // Buscar imágenes en la base de datos después de eliminarlas del FTP
        const remainingImages = await Imagenes_reptiles.findAll({
            where: {
                reptiles_id_reptil: idRegistro,
            },
        });

        // Eliminar las imágenes de la base de datos si aún existen
        await Promise.all(remainingImages.map(async (imagen) => {
            await imagen.destroy();
        }));


        // Eliminar las relaciones y la registro
        const existingRelations = await Reptiles.findByPk(idRegistro);
        if (!existingRelations) {
            throw new Error("La registro con el ID especificado no existe.");
        }

        await existingRelations.setPaises([]);
        await existingRelations.setZonasReptiles([]);
        await existingRelations.setImagenes_reptiles([]);

        // Finalmente, destruir la registro
        await existingRelations.destroy();

        return "registro eliminada correctamente junto con sus relaciones.";
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const findNameDuplicate = async (nombre) => {
    try {
        const existingRelations = await Reptiles.findAll({
            where: {
                nombre_ingles: nombre
            }
        });

        // Si encuentra Reptiles con el mismo nombre, arroja un error
        if (existingRelations.length > 0) {
            throw new Error("Este Nombre en Inglés ya existe.");
        }

        // Si no encuentra Reptiles con el mismo nombre, simplemente retorna
        return "Nombre en Inglés disponible.";

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const findAllEnglishNames = async () => {
    try {
        const registros = await Reptiles.findAll({
            attributes: ['nombre_ingles', 'id_reptil'], // Only fetches the 'nombre_ingles' attribute
            order: [['nombre_ingles', 'ASC']],
        });
        return registros; // Returns an array of objects, each containing 'nombre_ingles'
    } catch (error) {
        // Handle query errors
        console.error('Error fetching English names:', error);
        throw error;
    }
};

const getClassGrupoFamilia = async (idfamilia, idgrupo) => {
    try {
        let result = {};
        switch (true) {
            case !!idfamilia: {
                // Buscar todas las aves con el id_familia dado
                const registro = await Reptiles.findAll({
                    where: { familias_id_familia: idfamilia },
                    attributes: ['grupos_id_grupo',], // Solo necesitamos los id_grupo
                    group: ['grupos_id_grupo',] // Agrupar por id_grupo para evitar duplicados
                });

                // Extraer los id_grupo de las aves
                const idGrupos = [...new Set(registro.map(m => m.grupos_id_grupo))];
                // Buscar los grupos con los id_grupo obtenidos
                const grupos = await Grupos_reptiles.findAll({
                    where: { id_grupo: { [Op.in]: idGrupos } },
                    attributes: [['id_grupo', 'id'], 'nombre']
                });

                result = { grupos };
                break;
            }
            case !!idgrupo: {
                // Buscar las aves con el id_grupo dado
                const registro = await Reptiles.findAll({
                    where: {
                        grupos_id_grupo: idgrupo
                    },
                    attributes: ['familias_id_familia',], // Solo necesitamos los id_familia
                    group: ['familias_id_familia'] // Agrupar por id_familia para evitar duplicados
                });

                // Extraer los id_familia 
                const idFamilias = [...new Set(registro.map(m => m.familias_id_familia))];
                // const idFamilias = aves.map(registro => registro.familias_id_familia);

                // Buscar las familias con los id_familia obtenidos
                const familias = await Familias_reptiles.findAll({
                    where: {
                        id_familia: {
                            [Op.in]: idFamilias
                        }
                    },
                    attributes: [['id_familia', 'id'], 'nombre']
                });

                result = { familias, };
                break;;
            }

            default:
                throw new Error("Debes proporcionar al menos un parámetro (idfamilia, idgrupo).");
        }

        return result;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

const findGroupNameDuplicate = async (nombreGrupo) => {
    // console.log(nombreGrupo, ':grup');
    try {
        const existingGroups = await Grupos_reptiles.findAll({
            where: {
                nombre: nombreGrupo
            }
        });

        console.log(existingGroups);

        // Verifica si hay resultados
        if (existingGroups.length > 0) {
            throw new Error("Este Nombre del Grupo ya existe.");
        }

        return "Nombre de Grupo disponible.";

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};


const findOrdenNameDuplicate = async (nombreGrupo) => {
    try {
        const existingGroup = await Order_reptiles.findOne({
            where: { nombre: nombreGrupo }
        });

        console.log(existingGroup);

        // Si encuentra un grupo con el mismo nombre, arroja un error
        if (existingGroup) {
            throw new Error("Este Nombre de Orden ya existe.");
        }

        // Si no hay duplicado, retorna un mensaje de éxito (opcional)
        return "Nombre de Orden disponible.";

    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
};

const findFamilyNameDuplicate = async (nombreFamilia) => {
    try {
        const existingFamilies = await Familias_reptiles.findAll({
            where: {
                nombre: nombreFamilia
            }
        });

        // Si encuentra familias con el mismo nombre, arroja un error
        if (existingFamilies.length > 0) {
            throw new Error("Este Nombre de Familia ya existe.");
        }

        // Si no encuentra familias con el mismo nombre, simplemente retorna
        return "Nombre de Familia disponible.";

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const saveDbPhotoOrder = async (imagesArray) => {
    // console.log('llego array al controller:', imagesArray)
    try {
        // Itera sobre cada imagen en el array
        for (const image of imagesArray) {
            const { id, orden } = image;  // Extrae el id y el orden de cada imagen

            // Busca el registro en la base de datos que coincida con el id de la imagen
            const existingImage = await Imagenes_reptiles.findOne({
                where: { id: id }
            });

            // Si encuentra un registro con el id, actualiza el campo orden_imagenes
            if (existingImage) {
                await existingImage.update({ orden_imagenes: orden });
            } else {
                console.warn(`No se encontró una imagen con ID ${id}.`);
            }
        }

        return "Orden de imágenes actualizado correctamente.";
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

module.exports = {
    saveDbPhotoOrder,
    findOrdenNameDuplicate,
    findFamilyNameDuplicate,
    findGroupNameDuplicate,
    getClassGrupoFamilia,
    fetchOptions,
    filterOptions,
    fetchFilterRegister,
    sendAndCreateRegister,
    findDataById,
    sendAndUpdateRegister,
    findPhotosId,
    setDbCover,
    getContadores,
    filterOptionsPaisZonas,
    deleteRegistroDb,
    findDataByName,
    findNameDuplicate,
    findAllEnglishNames,
};
const { Op, Sequelize } = require("sequelize");
const { Peces, Grupos_peces, Familias_peces, Paises, Imagenes_peces, Zonas, } = require('../../config/db/db');
const mapFieldValues = require('../../utils/mapOptions');
const { obtenerIdDePais, obtenerIdDeZonas } = require("../../utils/OptionsZonaPais");
const { deletePhotoFromFTPpeces } = require("../../services/deletFtp");

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
        whereClause.grupos_id_grupo = grupoArray;
    }
    if (nombreCientifico) {
        whereClause.nombre_cientifico = { [Op.like]: `%${nombreCientifico}%` };
    }
    if (nombreIngles) {
        whereClause.nombre_ingles = { [Op.like]: `%${nombreIngles}%` };
    }
    return whereClause;
};

const buildIncludeArray = () => {
    return [
        { model: Grupos_peces, attributes: ['nombre'] },
        { model: Familias_peces, attributes: ['nombre'] },
        {
            model: Paises, // El mismo alias que en la definición de la asociación
            attributes: ['nombre', 'id_pais'],
            through: {
                attributes: []
            }
        },
        {
            model: Zonas,
            as: 'zonasPeces', // El mismo alias que en la definición de la asociación
            attributes: [['nombre_zona', 'nombre'], 'id_zona'],
            through: {
                attributes: ['zonas_id_zona']
            }
        },
        {
            model: Imagenes_peces,
            as: 'imagenes_peces',
            attributes: [['url_peces', 'url'], 'destacada', 'orden_imagen'],
            order: [['orden_imagen', 'ASC']],
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
        where: { id_pais: pais }
    };
};

const buildIncludeForZonas = (zonas) => {
    return {
        model: Zonas,
        as: 'zonasPeces',
        attributes: ['nombre_zona', 'id_zona'],
        through: {
            attributes: [],
        },
        where: {
            id_zona: zonas,
        },
    };
};

const fetchFilterFish = async (familia, grupo, nombreCientifico, nombreIngles, pais, zonas, page, perPage) => {
    try {
        nombreCientifico = decodeQueryParam(nombreCientifico);
        nombreIngles = decodeQueryParam(nombreIngles);

        const whereClause = buildWhereClause(familia, grupo, nombreCientifico, nombreIngles);
        let includeArr = buildIncludeArray(pais, zonas);

        // if (pais) {
        //     includeArr.push(buildIncludeForPais(pais));
        // }

        // if (zonas) {
        //     includeArr.push(buildIncludeForZonas(zonas));
        // }

        const pageConvert = Number(page) || DEFAULT_PAGE;
        const perPageConvert = perPage === '0' ? undefined : Number(perPage) || DEFAULT_PER_PAGE;
        const offset = perPageConvert ? (pageConvert - 1) * perPageConvert : 0;

        const registrosFiltrados = await Peces.findAll({
            where: whereClause,
            include: includeArr,
            limit: perPageConvert,
            offset: offset,
            order: [['nombre_ingles', 'ASC']],
        });

        // let totalResultsCount;
        // if (pais && zonas) {
        //     totalResultsCount = await Peces.count({
        //         where: whereClause,
        //         include: [buildIncludeForPais(pais), buildIncludeForZonas(zonas)]
        //     });
        // } else if (pais) {
        //     totalResultsCount = await Peces.count({
        //         where: whereClause,
        //         include: [buildIncludeForPais(pais)]
        //     });
        // } else if (zonas) {
        //     totalResultsCount = await Peces.count({
        //         where: whereClause,
        //         include: [buildIncludeForZonas(zonas)]
        //     });
        // } else {
        const totalResultsCount = await Peces.count({
            where: whereClause,
            include: buildIncludeArray(pais, zonas),
            distinct: true
        });

        const totalPages = Math.ceil(totalResultsCount / perPageConvert);
        const isLastPage = totalResultsCount <= 8 || pageConvert >= totalPages;

        return { registrosFiltrados, totalResultsCount, isLastPage };
    } catch (error) {
        console.error('Ocurrió un error al realizar la consulta:', error);
        throw new Error('Error al realizar la consulta de Peces');
    }
};


const fetchOptions = async () => {
    const optionsGrupos = await Grupos_peces.findAll({
        attributes: ['nombre', ['id_grupo', 'id']],
        order: [['nombre', 'ASC']]
    });
    const optionsFamilias = await Familias_peces.findAll({
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
    const optionsNames = await Peces.findAll({
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
    const allResults = await fetchFilterFish(
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
    allResults.registrosFiltrados.forEach(registro => {
        if (registro.dataValues && registro.grupos_peces && registro.grupos_peces.dataValues) {
            gruposSet.add(JSON.stringify({
                id: registro.dataValues.grupos_id_grupo,
                nombre: registro.grupo.dataValues.nombre
            }));
        }
    });
    const gruposArray = Array.from(gruposSet).map(grupo => JSON.parse(grupo));
    newOptions.grupos = gruposArray

    const familiasSet = new Set();
    allResults.registrosFiltrados.forEach(registro => {
        if (registro.dataValues && registro.familias_peces && registro.familias_peces.dataValues) {
            familiasSet.add(JSON.stringify({
                id: registro.dataValues.familias_id_familia,
                nombre: registro.familia.dataValues.nombre
            }));
        }
    });
    const familiasArray = Array.from(familiasSet).map(item => JSON.parse(item));
    newOptions.familias = familiasArray;

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
        if (registro.zonasPeces && Array.isArray(registro.zonasPeces)) {
            registro.zonasPeces.forEach(zona => {
                if (zona.dataValues) {
                    zonasSet.add(JSON.stringify({
                        id: zona.dataValues.id_zona,
                        nombre: zona.dataValues.nombre
                    }));

                }
            });
        }
    });
    newOptions.zonas = Array.from(zonasSet).map(zona =>
        JSON.parse(zona));

    const nombresCientificos = [...new Set(allResults.registrosFiltrados.map(registro => ({ id: registro.id_pez, nombre: registro.dataValues.nombre_cientifico })))];
    newOptions.nCientifico = nombresCientificos;
    const nombresIngles = [...new Set(allResults.registrosFiltrados.map(registro => ({ id: registro.id_pez, nombre: registro.dataValues.nombre_ingles })))];
    newOptions.nIngles = nombresIngles;
    // const listaZona = [...new Set(allResults.map(registro => ({ id: registro.id_pez, nombre: registro.dataValues.zonas })))];
    // newOptions.zonas = listaZona;
    return newOptions;
};

const filterOptionsPaisZonas = async (
    familia,
    grupo,
    nombreCientifico,
    nombreIngles,
    pais,
    zonas,
) => {

    const perpage = '0'
    const page = '0'
    const allResults = await fetchFilterFish(
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
        Familias: [],
        paises: [],
        zonas: [],
        nIngles: [],
        nCientifico: [],
    };

    // Verificar si se proporcionó un ID de zona o un ID de país
    if (!allResults?.registrosFiltrados) {
        return newOptions; // Retornar vacío si no hay datos
    }

    if (zonas || pais) {

        const paisNumb = parseInt(pais)
        // Filtrar las Peces según el país y las zonas proporcionadas
        allResults.registrosFiltrados = allResults.registrosFiltrados.filter(registro => {
            // console.log(allResults)
            const meetsPaisCriteria = !pais || (registro.paises?.some(paisR => paisR?.dataValues?.id_pais === paisNumb));
            const meetsZonasCriteria = !zonas || (registro.zonasPeces?.some(zona => zonas.includes(zona?.dataValues?.id_zona)));
            return meetsPaisCriteria && meetsZonasCriteria;
        });
    }
    // Lógica para construir las opciones de paises y zonas
    if (zonas) {
        // Construir opciones de países basadas en las Peces filtradas
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

        const findIdPais = await obtenerIdDePais(zonas)
        const newopti = Array.from(paisesSet).filter(pais => findIdPais.includes(JSON.parse(pais).id));
        newOptions.paises = newopti.map(JSON.parse).sort((a, b) => a.nombre.localeCompare(b.nombre));

        const zonasSet = new Set();
        allResults.registrosFiltrados.forEach(registro => {
            registro.zonasPeces?.forEach(zona => {
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
        // console.log(allResults.registrosFiltrados)
        // console.log('entro en pais');
        // Construir opciones de zonas basadas en las Peces filtradas
        const zonasSet = new Set();
        allResults.registrosFiltrados.forEach(registro => {
            registro.zonasPeces?.forEach(zona => {
                if (zona?.dataValues) {
                    zonasSet.add(JSON.stringify({
                        id: zona.dataValues.id_zona,
                        nombre: zona.dataValues.nombre,
                    }));
                }
            });
        });

        // console.log(zonasSet);
        const findIdZonas = await obtenerIdDeZonas(pais);
        // console.log(findIdZonas);
        const newOptionsZona = Array.from(zonasSet).filter(zona => findIdZonas.includes(JSON.parse(zona).id));

        // Transformar el formato de newOptionsZona
        // const transformedOptionsZona = newOptionsZona.map(option => ({
        //     id: JSON.parse(option).id,
        //     nombre: JSON.parse(option).nombre,
        // }));
        // console.log(transformedOptionsZona)
        // newOptions.zonas = transformedOptionsZona
        // console.log(newOptions.zonas);
        newOptions.zonas = newOptionsZona.map(JSON.parse).sort((a, b) => a.nombre.localeCompare(b.nombre));

        const paisSet = new Set();
        allResults.registrosFiltrados.forEach(registro => {
            registro.paises?.forEach(zona => {
                if (pais?.dataValues) {
                    paisSet.add(JSON.stringify({
                        id: zona.dataValues.id_pais,
                        nombre: zona.dataValues.nombre
                    }));
                }
            });
        });
        // console.log(paisSet)
        newOptions.paises = Array.from(paisSet).map(JSON.parse).sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
    const gruposSet = new Set();
    allResults.registrosFiltrados.forEach(registro => {
        if (registro.grupos_mamifero?.dataValues) {
            gruposSet.add(JSON.stringify({
                id: registro.dataValues.grupos_id_grupo,
                nombre: registro.grupo.dataValues.nombre
            }));
        }
    });
    // const gruposArray = Array.from(gruposSet).map(grupo => JSON.parse(grupo));
    // newOptions.grupos = gruposArray
    newOptions.grupos = Array.from(gruposSet).map(JSON.parse).sort((a, b) => a.nombre.localeCompare(b.nombre));

    const familiasSet = new Set();
    allResults.registrosFiltrados.forEach(registro => {
        if (registro.familias_mamifero?.dataValues) {
            familiasSet.add(JSON.stringify({
                id: registro.dataValues.familias_id_familia,
                nombre: registro.familia.dataValues.nombre
            }));
        }
    });
    newOptions.familias = Array.from(familiasSet).map(JSON.parse).sort((a, b) => a.nombre.localeCompare(b.nombre));
    // const familiasArray = Array.from(familiasSet).map(item => JSON.parse(item));
    // newOptions.Familias = familiasArray;
    // Construir opciones de nombres científicos
    newOptions.nCientifico = [...new Set(
        allResults.registrosFiltrados.map(registro => ({
            id: registro.id_pez,
            nombre: registro.dataValues?.nombre_cientifico || '',
        }))
    )].sort((a, b) => a.nombre.localeCompare(b.nombre));

    // Construir opciones de nombres en inglés
    newOptions.nIngles = [...new Set(
        allResults.registrosFiltrados.map(registro => ({
            id: registro.id_pez,
            nombre: registro.dataValues?.nombre_ingles || '',
        }))
    )].sort((a, b) => a.nombre.localeCompare(b.nombre));
    // const nombresCientificos = [...new Set(allResults.registrosFiltrados.map(registro => ({ id: registro.id_pez, nombre: registro.dataValues.nombre_cientifico })))];
    // newOptions.nCientifico = nombresCientificos;
    // const nombresIngles = [...new Set(allResults.registrosFiltrados.map(registro => ({ id: registro.id_pez, nombre: registro.dataValues.nombre_ingles })))];
    // newOptions.nIngles = nombresIngles;
    // const listaZona = [...new Set(allResults.map(registro => ({ id: registro.id_pez, nombre: registro.dataValues.zonas })))];
    // newOptions.zonas = listaZona;
    return newOptions;
};

const sendAndCreateFish = async (
    grupo,
    familia,
    paises,
    zona,
    cientifico,
    ingles,
    comun,
    urlWiki,
    urlImagen
) => {
    try {
        // Verificar si el nombre en inglés está presente (obligatorio)
        if (!ingles) {
            throw new Error('El nombre en inglés es obligatorio.');
        }
        // Aplicar conversiones solo si los datos opcionales están presentes
        const convertCientifico = cientifico ? cientifico.charAt(0).toUpperCase() + cientifico.slice(1).toLowerCase() : null;
        const convertComun = comun ? comun.charAt(0).toUpperCase() + comun.slice(1).toLowerCase() : null;
        const imagenesRegistrosData = urlImagen?.length
            ? urlImagen.map((imageUrl, index) => ({
                url_peces: imageUrl,
                orden_imagen: index + 1
            }))
            : [];;
        // Crear un nuevo registro en la tabla "Peces" solo si el nombre en inglés está presente

        const createNew = await Peces.create({
            nombre_ingles: ingles,
            nombre_cientifico: convertCientifico,
            nombre_comun: convertComun,
            url_wiki: urlWiki,
            grupos_id_grupo: grupo.id,
            familias_id_familia: familia.id,
            imagenes_peces: imagenesRegistrosData
        }, {
            include: Imagenes_peces,
        });
        for (const pais of paises) {
            await createNew.addPaises(pais.id);
        }
        for (const zonas of zona) {
            await createNew.addZonasPeces(zonas.id);
        }
        // Busca el registro recién creada por el nombre en inglés
        const createdRegistro = await Peces.findOne({
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
    }
};

const findDataById = async (id) => {
    try {
        const registro = await Peces.findOne({
            where: { id_pez: id },
            include: [
                {
                    model: Imagenes_peces,
                    attributes: [['url_peces', 'url'],
                        'id',
                        'destacada',
                        'orden_imagen',
                    [Sequelize.literal('SUBSTRING_INDEX(url_peces, "_", -1)'), 'titulo']
                        ,] // Atributos que deseas de Imagenes_peces
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
                    as: 'zonasPeces',
                    attributes: [['nombre_zona', 'nombre'], ['id_zona', 'id']],
                    through: {
                        attributes: [],
                    }, // Atributos que deseas de Paises
                },
                { model: Grupos_peces, attributes: ['nombre', ['id_grupo', 'id']] },
                { model: Familias_peces, attributes: ['nombre', ['id_familia', 'id']] },
            ],
            attributes: [
                'id_pez',
                'nombre_ingles',
                'nombre_cientifico',
                'nombre_comun',
                'url_wiki',], // Atributos de Peces que deseas
            order: [[{ model: Imagenes_peces }, 'orden_imagen', 'ASC']],
        });
        // ✅ Ordenar manualmente las imágenes (por orden_imagen como número)
        if (registro && registro.imagenes_peces) {
            registro.imagenes_peces.sort((a, b) => Number(a.orden_imagen) - Number(b.orden_imagen));
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
        const registro = await Peces.findOne({
            where: { nombre_ingles: name },
            include: [
                {
                    model: Imagenes_peces,
                    attributes: [
                        'url_peces',
                        'id',
                        'destacada',
                        'orden_imagen',
                        [Sequelize.literal('SUBSTRING_INDEX(url_peces, "_", -1)'), 'titulo']
                        ,] // Atributos que deseas de Imagenes_peces
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
                    as: 'zonasPeces',
                    attributes: [['nombre_zona', 'nombre'], ['id_zona', 'id']],
                    through: {
                        attributes: [],
                    }, // Atributos que deseas de Paises
                },
                { model: Grupos_peces, attributes: ['nombre', ['id_grupo', 'id']] },
                { model: Familias_peces, attributes: ['nombre', ['id_familia', 'id']] },
            ],
            attributes: [
                'id_pez',
                'nombre_ingles',
                'nombre_cientifico',
                'nombre_comun',
                'url_wiki',], // Atributos de Peces que deseas
            order: [[{ model: Imagenes_peces }, 'orden_imagen', 'ASC']],
        });
        // ✅ Ordenar manualmente las imágenes (por orden_imagen como número)
        if (registro && registro.imagenes_peces) {
            registro.imagenes_peces.sort((a, b) => Number(a.orden_imagen) - Number(b.orden_imagen));
        }
        return registro;
    } catch (error) {
        // Manejar errores de consulta
        console.error('Error en la consulta:', error);
        throw error;
    }
};


const sendAndUpdateFish = async (
    grupo,
    familia,
    paises,
    zona,
    cientifico,
    ingles,
    comun,
    urlWiki,
    urlImagen,
    idRegistro,
) => {
    try {
        // ✅ Obtener pez existente
        const existingFish = await Peces.findOne({
            where: { id_pez: idRegistro },
        });

        if (!existingFish) {
            throw new Error("El registro con ID especificado no existe.");
        }

        // ✅ Comparar cambios
        const cambios = {
            nombre_ingles: ingles !== existingFish.nombre_ingles ? ingles : undefined,
            nombre_cientifico: cientifico !== existingFish.nombre_cientifico ? cientifico : undefined,
            nombre_comun: comun !== existingFish.nombre_comun ? comun : undefined,
            url_wiki: urlWiki !== existingFish.url_wiki ? urlWiki : undefined,
            grupos_id_grupo: grupo.id !== existingFish.grupos_id_grupo ? grupo.id : undefined,
            familias_id_familia: familia.id !== existingFish.familias_id_familia ? familia.id : undefined,
        };

        const cambiosFiltrados = Object.fromEntries(
            Object.entries(cambios).filter(([_, value]) => value !== undefined)
        );

        if (Object.keys(cambiosFiltrados).length > 0) {
            if (cambiosFiltrados.nombre_ingles) {
                const temporalName = `temp_${Math.random().toString(36).substring(2, 15)}`;

                await Peces.update(
                    { nombre_ingles: temporalName },
                    { where: { id_pez: idRegistro } }
                );

                await Peces.update(
                    { nombre_ingles: ingles },
                    { where: { id_pez: idRegistro } }
                );

                delete cambiosFiltrados.nombre_ingles;
            }

            await Peces.update(cambiosFiltrados, {
                where: { id_pez: idRegistro },
            });
        }

        // ✅ Obtener imágenes actuales
        const existingImages = await Imagenes_peces.findAll({
            where: { peces_id_pez: idRegistro },
            order: [["orden_imagen", "ASC"]],
        });

        // ✅ Asignar orden a imágenes sin orden
        let ordenCounter = 1;
        for (const img of existingImages) {
            if (img.orden_imagen === null) {
                await img.update({ orden_imagen: ordenCounter });
            }
            ordenCounter++;
        }

        // ✅ Obtener máximo orden actual
        const maxOrdenImage = await Imagenes_peces.findOne({
            where: { peces_id_pez: idRegistro },
            order: [["orden_imagen", "DESC"]],
        });

        let lastOrden = maxOrdenImage?.orden_imagen || 0;

        // ✅ Insertar nuevas imágenes
        for (const imageUrl of urlImagen) {
            lastOrden += 1;
            await Imagenes_peces.create({
                peces_id_pez: idRegistro,
                url_peces: imageUrl,
                orden_imagen: lastOrden,
            });
        }

        // ✅ Actualizar relaciones de países y zonas
        const existingRelations = await Peces.findByPk(idRegistro);
        if (existingRelations) {
            await existingRelations.setPaises([]);
            await existingRelations.setZonasPeces([]);
        }

        for (const pais of paises) {
            await existingRelations.addPaises(pais.id);
        }

        for (const zonita of zona) {
            await existingRelations.addZonasPeces(zonita.id);
        }

        return "El registro se ha actualizado correctamente.";
    } catch (error) {
        console.log("Error:", error);
    }
};

const findPhotosId = async (imgsIds) => {
    try {
        await Imagenes_peces.destroy({ where: { id: imgsIds } });
        return 'Las fotografías se han borrado exitosamente'
    } catch (error) {
        console.error('Error al buscar fotos por ID de registro:', error);
        throw error;
    }
};


const setDbCover = async (idFoto, idRegistro) => {
    try {
        // Buscar todas las imágenes asociadas al registro
        const imag = await Imagenes_peces.findAll({ where: { peces_id_pez: idRegistro } });
        // Encontrar la imagen destacada actual, si la hay
        const imagenDestacadaActual = imag.find((imagen) => imagen.destacada === true);
        // Desmarcar la imagen destacada actual, si la hay
        if (imagenDestacadaActual) {
            await imagenDestacadaActual.update({ destacada: null });
        }
        // Marcar la nueva imagen como destacada
        const imagenNuevaDestacada = await Imagenes_peces.findByPk(idFoto);
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
        const allRegistros = await Peces.count();
        const allEnglish = await Peces.count({
            where: {
                nombre_ingles: {
                    [Sequelize.Op.not]: null, // El nombre en inglés no es nulo
                    [Sequelize.Op.not]: ''    // El nombre en inglés no está vacío
                }
            }
        });
        const allCientifico = await Peces.count({
            where: {
                nombre_cientifico: {
                    [Sequelize.Op.not]: null, // El nombre en inglés no es nulo
                    [Sequelize.Op.not]: ''    // El nombre en inglés no está vacío
                }
            }
        });
        const allComun = await Peces.count({
            where: {
                nombre_comun: {
                    [Sequelize.Op.not]: null, // El nombre en inglés no es nulo
                    [Sequelize.Op.not]: ''    // El nombre en inglés no está vacío
                }
            }
        });
        // const withoutContry = await Peces.count({
        //     where: {
        //         [Sequelize.Op.not]: Sequelize.literal('EXISTS (SELECT 1 FROM peces_has_paises WHERE Peces.id_pez = peces_has_paises.peces_id_pez)'),
        //     },
        // })
        const allCountrys = await Paises.count({
            distinct: true,
            col: 'id_pais', // Ajusta según el nombre real de la columna en tu modelo
            include: [{
                model: Peces,
                through: 'peces_has_paises',
                attributes: [], // Evita recuperar todos los atributos de la relación
                required: true, // Utiliza una inner join para asegurar que solo obtengas registros que tengan relaciones en peces_has_paises
            }],
        });

        const allGrupos = await Grupos_peces.count();
        const allFamilias = await Familias_peces.count()
        const allZonas = await Zonas.count({
            distinct: true,
            col: 'id_zona', // Ajusta según el nombre real de la columna en tu modelo
            include: [{
                model: Peces,
                through: 'peces_has_zonas',
                as: 'zoPeces',
                attributes: [], // Evita recuperar todos los atributos de la relación
                required: true, // Utiliza una inner join para asegurar que solo obtengas registros que tengan relaciones en peces_has_paises
            }],
        })


        return { allRegistros, allEnglish, allCientifico, allComun, allGrupos, allFamilias, allZonas, allCountrys }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const deleteRegistroDb = async (idRegistro) => {
    try {
        const imagenes = await Imagenes_peces.findAll({
            where: {
                peces_id_pez: idRegistro,
            },
        });

        const ftpDeleteResults = await deletePhotoFromFTPpeces(imagenes.map(imagen => imagen.url_peces));

        if (!ftpDeleteResults.success) {
            // Si hay un problema al borrar las fotos del FTP, puedes manejar el error aquí
            throw new Error("Error al borrar las fotos del FTP.");
        }

        // Buscar imágenes en la base de datos después de eliminarlas del FTP
        const remainingImages = await Imagenes_peces.findAll({
            where: {
                peces_id_pez: idRegistro,
            },
        });

        // Eliminar las imágenes de la base de datos si aún existen
        await Promise.all(remainingImages.map(async (imagen) => {
            await imagen.destroy();
        }));


        // Eliminar las relaciones y la registro
        const existingRelations = await Peces.findByPk(idRegistro);
        if (!existingRelations) {
            throw new Error("La registro con el ID especificado no existe.");
        }

        await existingRelations.setPaises([]);
        await existingRelations.setZonasPeces([]);
        await existingRelations.setImagenes_peces([]);

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
        const existingRelations = await Peces.findAll({
            where: {
                nombre_ingles: nombre
            }
        });

        // Si encuentra Peces con el mismo nombre, arroja un error
        if (existingRelations.length > 0) {
            throw new Error("Este Nombre en Inglés ya existe.");
        }

        // Si no encuentra Peces con el mismo nombre, simplemente retorna
        return "Nombre en Inglés disponible.";

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const findAllEnglishNames = async () => {
    try {
        const registros = await Peces.findAll({
            attributes: ['nombre_ingles', 'id_pez'],
            order: [['nombre_ingles', 'ASC']], // Only fetches the 'nombre_ingles' attribute
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
                const pez = await Peces.findAll({
                    where: {
                        familias_id_familia: idfamilia
                    },
                    attributes: ['grupos_id_grupo'], // Solo necesitamos los id_grupo
                    group: ['grupos_id_grupo'] // Agrupar por id_grupo para evitar duplicados
                });

                // Extraer los id_grupo de las aves
                const idGrupos = [...new Set(pez.map(registro => registro.grupos_id_grupo))];

                // Buscar los grupos con los id_grupo obtenidos
                const grupos = await Grupos_peces.findAll({
                    where: {
                        id_grupo: {
                            [Op.in]: idGrupos
                        }
                    },
                    attributes: [['id_grupo', 'id'], 'nombre']
                });

                return { grupos };
                break;
            }
            case !!idgrupo: {
                // Buscar las aves con el id_grupo dado
                const pez = await Peces.findAll({
                    where: {
                        grupos_id_grupo: idgrupo
                    },
                    attributes: ['familias_id_familia'], // Solo necesitamos los id_familia
                    group: ['familias_id_familia'] // Agrupar por id_familia para evitar duplicados
                });

                // Extraer los id_familia de las aves
                const idFamilias = [...new Set(pez.map(registro => registro.familias_id_familia))];

                // Buscar las familias con los id_familia obtenidos
                const familias = await Familias_peces.findAll({
                    where: {
                        id_familia: {
                            [Op.in]: idFamilias
                        }
                    },
                    attributes: [['id_familia', 'id'], 'nombre']
                });

                return { familias };
                break;
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
    // console.log(nombreGrupo)
    try {
        const existingGroups = await Grupos_peces.findOne({
            where: {
                nombre: nombreGrupo
            }
        });

        // Si encuentra grupos con el mismo nombre, arroja un error
        if (existingGroups) {
            throw new Error("Este Nombre de Grupo ya existe.");
        }

        // Si no encuentra grupos con el mismo nombre, simplemente retorna
        return "Nombre de Grupo disponible.";

    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
};

const findFamilyNameDuplicate = async (nombreFamilia) => {
    try {
        const existingFamilies = await Familias_peces.findAll({
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
            const existingImage = await Imagenes_peces.findOne({
                where: { id: id }
            });

            // Si encuentra un registro con el id, actualiza el campo orden_imagenes
            if (existingImage) {
                await existingImage.update({ orden_imagen: orden });
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
    findAllEnglishNames,
    getClassGrupoFamilia,
    findFamilyNameDuplicate,
    findGroupNameDuplicate,
    fetchOptions,
    filterOptions,
    fetchFilterFish,
    sendAndCreateFish,
    findDataById,
    sendAndUpdateFish,
    findPhotosId,
    setDbCover,
    getContadores,
    filterOptionsPaisZonas,
    deleteRegistroDb,
    findDataByName,
    findNameDuplicate,
};
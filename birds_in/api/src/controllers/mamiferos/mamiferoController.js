const { Op, Sequelize } = require("sequelize");
const { Mamiferos, Grupos_mamiferos, Familias_mamiferos, Paises, Imagenes_mamiferos, Zonas, } = require('../../config/db/db');
const mapFieldValues = require('../../utils/mapOptions');
const { obtenerIdDePais, obtenerIdDeZonas } = require("../../utils/OptionsZonaPais");
const { deletePhotoFromFTPMamiferos } = require("../../services/deletFtp");

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
        { model: Grupos_mamiferos, attributes: ['nombre'] },
        { model: Familias_mamiferos, attributes: ['nombre'] },
        {
            model: Paises, // El mismo alias que en la definición de la asociación
            attributes: ['nombre', 'id_pais'],
            through: {
                attributes: []
            }
        },
        {
            model: Zonas,
            as: 'zonasMamiferos', // El mismo alias que en la definición de la asociación
            attributes: [['nombre_zona', 'nombre'], 'id_zona'],
            through: {
                attributes: ['zonas_id_zona']
            }
        },
        {
            model: Imagenes_mamiferos,
            as: 'imagenes_mamiferos',
            attributes: [['url_mamifero', 'url'], 'destacada']
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
        as: 'zonasMamiferos',
        attributes: ['nombre_zona', 'id_zona'],
        through: {
            attributes: [],
        },
        where: {
            id_zona: zonas,
        },
    };
};

const fetchFilterRegister = async (familia, grupo, nombreCientifico, nombreIngles, pais, zonas, page, perPage) => {
    try {
        nombreCientifico = decodeQueryParam(nombreCientifico);
        nombreIngles = decodeQueryParam(nombreIngles);

        const whereClause = buildWhereClause(familia, grupo, nombreCientifico, nombreIngles);
        let includeArr = buildIncludeArray();

        if (pais) {
            includeArr.push(buildIncludeForPais(pais));
        }

        if (zonas) {
            includeArr.push(buildIncludeForZonas(zonas));
        }

        const pageConvert = Number(page) || DEFAULT_PAGE;
        const perPageConvert = perPage === '0' ? undefined : Number(perPage) || DEFAULT_PER_PAGE;
        const offset = perPageConvert ? (pageConvert - 1) * perPageConvert : 0;

        const registrosFiltrados = await Mamiferos.findAll({
            where: whereClause,
            include: includeArr,
            limit: perPageConvert,
            offset: offset,
            order: [['nombre_ingles', 'ASC']],
        });

        let totalResultsCount;
        if (pais && zonas) {
            totalResultsCount = await Mamiferos.count({
                where: whereClause,
                include: [buildIncludeForPais(pais), buildIncludeForZonas(zonas)]
            });
        } else if (pais) {
            totalResultsCount = await Mamiferos.count({
                where: whereClause,
                include: [buildIncludeForPais(pais)]
            });
        } else if (zonas) {
            totalResultsCount = await Mamiferos.count({
                where: whereClause,
                include: [buildIncludeForZonas(zonas)]
            });
        } else {
            totalResultsCount = await Mamiferos.count({ where: whereClause });
        }

        const totalPages = Math.ceil(totalResultsCount / perPageConvert);
        const isLastPage = totalResultsCount <= 8 || pageConvert >= totalPages;

        return { registrosFiltrados, totalResultsCount, isLastPage };
    } catch (error) {
        console.error('Ocurrió un error al realizar la consulta:', error);
        throw new Error('Error al realizar la consulta de Mamiferos');
    }
};


const fetchOptions = async () => {
    const optionsGrupos = await Grupos_mamiferos.findAll({
        attributes: ['nombre', ['id_grupo', 'id']],
        order: [['nombre', 'ASC']]
    });
    const optionsFamilias = await Familias_mamiferos.findAll({
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
    const optionsNames = await Mamiferos.findAll({
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
    // console.log(optionsGrupos)
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
    const perpage = '0';
    const page = '0';
    const allResults = await fetchFilterRegister(
        grupo,
        familia,
        pais,
        nombreIngles,
        nombreCientifico,
        zonas,
        page,
        perpage
    );

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
        if (registro.dataValues && registro.grupos_mamifero && registro.grupos_mamifero.dataValues) {
            gruposSet.add(JSON.stringify({
                id: registro.dataValues.grupos_id_grupo,
                nombre: registro.grupos_mamifero.dataValues.nombre
            }));
        }
    });
    newOptions.grupos = Array.from(gruposSet).map(grupo => JSON.parse(grupo));

    const familiasSet = new Set();
    allResults.registrosFiltrados.forEach(registro => {
        if (registro.dataValues && registro.familias_mamifero && registro.familias_mamifero.dataValues) {
            familiasSet.add(JSON.stringify({
                id: registro.dataValues.familias_id_familia,
                nombre: registro.familias_mamifero.dataValues.nombre
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
        if (registro.zonasMamiferos && Array.isArray(registro.zonasMamiferos)) {
            registro.zonasMamiferos.forEach(zona => {
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
        id: registro.id_mamifero,
        nombre: registro.dataValues ? registro.dataValues.nombre_cientifico : null
    })))];
    newOptions.nCientifico = nombresCientificos;

    const nombresIngles = [...new Set(allResults.registrosFiltrados.map(registro => ({
        id: registro.id_mamifero,
        nombre: registro.dataValues ? registro.dataValues.nombre_ingles : null
    })))];
    newOptions.nIngles = nombresIngles;

    return newOptions;
};


const filterOptionsPaisZonas = async (familia, grupo, nombreCientifico, nombreIngles, pais, zonas) => {
    const perpage = '0';
    const page = '0';
    const allResults = await fetchFilterRegister(
        familia,
        grupo,
        nombreCientifico,
        nombreIngles,
        pais,
        zonas,
        page,
        perpage
    );

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
        const paisNumb = parseInt(pais);

        // Filtrar las Mamiferos según el país y las zonas proporcionadas
        allResults.registrosFiltrados = allResults.registrosFiltrados.filter(registro => {
            const meetsPaisCriteria = !pais || registro.paises.some(pais => pais.dataValues && pais.dataValues.id_pais === paisNumb);
            const meetsZonasCriteria = !zonas || registro.zonasMamiferos.some(zona => zonas.includes(zona.dataValues && zona.dataValues.id_zona));
            return meetsPaisCriteria && meetsZonasCriteria;
        });
    }

    // Lógica para construir las opciones de países y zonas
    if (zonas) {
        // Construir opciones de países basadas en las Mamiferos filtradas
        const paisesSet = new Set();
        allResults.registrosFiltrados.forEach(registro => {
            if (registro.paises && Array.isArray(registro.paises)) {
                registro.paises.forEach(pais => {
                    if (pais.dataValues) {
                        paisesSet.add(JSON.stringify({
                            id: pais.dataValues.id_pais,
                            nombre: pais.dataValues.nombre,
                        }));
                    }
                });
            }
        });

        const findIdPais = await obtenerIdDePais(zonas);

        const newopti = Array.from(paisesSet).filter(pais => findIdPais.includes(JSON.parse(pais).id));

        newOptions.paises = newopti.map(pais => JSON.parse(pais));

        const zonasSet = new Set();
        allResults.registrosFiltrados.forEach(registro => {
            if (registro.zonasMamiferos && Array.isArray(registro.zonasMamiferos)) {
                registro.zonasMamiferos.forEach(zona => {
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
    }

    if (pais) {
        // Construir opciones de zonas basadas en las Mamiferos filtradas
        const zonasSet = new Set();
        allResults.registrosFiltrados.forEach(registro => {
            if (registro.zonasMamiferos && Array.isArray(registro.zonasMamiferos)) {
                registro.zonasMamiferos.forEach(zona => {
                    if (zona.dataValues) {
                        zonasSet.add(JSON.stringify({
                            id: zona.dataValues.id_zona,
                            nombre: zona.dataValues.nombre,
                        }));
                    }
                });
            }
        });

        const findIdZonas = await obtenerIdDeZonas(pais);
        const newOptionsZona = Array.from(zonasSet).filter(zona => findIdZonas.includes(JSON.parse(zona).id));

        newOptions.zonas = newOptionsZona.map(option => ({
            id: JSON.parse(option).id,
            nombre: JSON.parse(option).nombre,
        }));

        const paisSet = new Set();
        allResults.registrosFiltrados.forEach(registro => {
            if (registro.paises && Array.isArray(registro.paises)) {
                registro.paises.forEach(pais => {
                    if (pais.dataValues) {
                        paisSet.add(JSON.stringify({
                            id: pais.dataValues.id_pais,
                            nombre: pais.dataValues.nombre
                        }));
                    }
                });
            }
        });
        newOptions.paises = Array.from(paisSet).map(pa => JSON.parse(pa));
    }

    // Construir opciones de grupos
    const gruposSet = new Set();
    allResults.registrosFiltrados.forEach(registro => {
        if (registro.dataValues && registro.grupo && registro.grupo.dataValues) {
            gruposSet.add(JSON.stringify({
                id: registro.dataValues.grupos_id_grupo,
                nombre: registro.grupo.dataValues.nombre
            }));
        }
    });
    newOptions.grupos = Array.from(gruposSet).map(grupo => JSON.parse(grupo));

    // Construir opciones de familias
    const familiasSet = new Set();
    allResults.registrosFiltrados.forEach(registro => {
        if (registro.dataValues && registro.familia && registro.familia.dataValues) {
            familiasSet.add(JSON.stringify({
                id: registro.dataValues.familias_id_familia,
                nombre: registro.familia.dataValues.nombre
            }));
        }
    });
    newOptions.familias = Array.from(familiasSet).map(item => JSON.parse(item));

    // Construir opciones de nombres científicos
    const nombresCientificos = [...new Set(allResults.registrosFiltrados.map(registro => ({
        id: registro.id_mamifero,
        nombre: registro.dataValues ? registro.dataValues.nombre_cientifico : null
    })))];
    newOptions.nCientifico = nombresCientificos;

    // Construir opciones de nombres en inglés
    const nombresIngles = [...new Set(allResults.registrosFiltrados.map(registro => ({
        id: registro.id_mamifero,
        nombre: registro.dataValues ? registro.dataValues.nombre_ingles : null
    })))];
    newOptions.nIngles = nombresIngles;

    return newOptions;
};


const sendAndCreateRegister = async (
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
        const imagenesRegistrosData = urlImagen.map((imageUrl) => {
            return {
                url_mamifero: imageUrl,
            };
        });
        // Crear un nuevo registro en la tabla "Mamiferos" solo si el nombre en inglés está presente
        if (ingles) {
            const createNew = await Mamiferos.create({
                nombre_ingles: ingles,
                nombre_cientifico: convertCientifico,
                nombre_comun: convertComun,
                url_wiki: urlWiki,
                grupos_id_grupo: grupo.id,
                familias_id_familia: familia.id,
                imagenes_mamiferos: imagenesRegistrosData
            }, {
                include: Imagenes_mamiferos,
            });
            for (const pais of paises) {
                await createNew.addPaises(pais.id);
            }
            for (const zonas of zona) {
                await createNew.addZonasMamiferos(zonas.id);
            }
            // Busca el registro recién creada por el nombre en inglés
            const createdRegistro = await Mamiferos.findOne({
                where: {
                    nombre_ingles: ingles
                },
            });
            return { message: "El registro se ha creado correctamente.", registro: createdRegistro };
        } else {
            return { message: "El nombre en inglés es obligatorio.", registro: null };
        }
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
        const registro = await Mamiferos.findOne({
            where: { id_mamifero: id },
            include: [
                {
                    model: Imagenes_mamiferos,
                    attributes: [['url_mamifero', 'url'],
                        'id',
                        'destacada',
                    [Sequelize.literal('SUBSTRING_INDEX(url_mamifero, "_", -1)'), 'titulo']
                        ,] // Atributos que deseas de Imagenes_mamiferos
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
                    as: 'zonasMamiferos',
                    attributes: [['nombre_zona', 'nombre'], ['id_zona', 'id']],
                    through: {
                        attributes: [],
                    }, // Atributos que deseas de Paises
                },
                { model: Grupos_mamiferos, attributes: ['nombre', ['id_grupo', 'id']] },
                { model: Familias_mamiferos, attributes: ['nombre', ['id_familia', 'id']] },
            ],
            attributes: [
                'id_mamifero',
                'nombre_ingles',
                'nombre_cientifico',
                'nombre_comun',
                'url_wiki',] // Atributos de Mamiferos que deseas
        });
        return registro;
    } catch (error) {
        // Manejar errores de consulta
        console.error('Error en la consulta:', error);
        throw error;
    }
};


const findDataByName = async (name) => {
    try {
        const registro = await Mamiferos.findOne({
            where: { nombre_ingles: name },
            include: [
                {
                    model: Imagenes_mamiferos,
                    attributes: [['url_mamifero', 'url'],
                        'id',
                        'destacada',
                    [Sequelize.literal('SUBSTRING_INDEX(url_mamifero, "_", -1)'), 'titulo']
                        ,] // Atributos que deseas de Imagenes_mamiferos
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
                    as: 'zonasMamiferos',
                    attributes: [['nombre_zona', 'nombre'], ['id_zona', 'id']],
                    through: {
                        attributes: [],
                    }, // Atributos que deseas de Paises
                },
                { model: Grupos_mamiferos, attributes: ['nombre', ['id_grupo', 'id']] },
                { model: Familias_mamiferos, attributes: ['nombre', ['id_familia', 'id']] },
            ],
            attributes: [
                'id_mamifero',
                'nombre_ingles',
                'nombre_cientifico',
                'nombre_comun',
                'url_wiki',] // Atributos de Mamiferos que deseas
        });
        return registro;
    } catch (error) {
        // Manejar errores de consulta
        console.error('Error en la consulta:', error);
        throw error;
    }
};


const sendAndUpdateRegister = async (
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
        // Obtener el registro existente de la base de datos
        const existingInsect = await Mamiferos.findOne({
            where: {
                id_mamifero: idRegistro,
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
            grupos_id_grupo: grupo.id !== existingInsect.grupos_id_grupo ? grupo.id : undefined,
            familias_id_familia: familia.id !== existingInsect.familias_id_familia ? familia.id : undefined,
        };

        // Filtrar valores undefined
        const cambiosFiltrados = Object.fromEntries(Object.entries(cambios).filter(([key, value]) => value !== undefined));

        if (Object.keys(cambiosFiltrados).length > 0) {
            // Si nombre_ingles es diferente, hacer el cambio en dos pasos
            if (cambiosFiltrados.nombre_ingles) {
                const temporalName = `temp_${Math.random().toString(36).substring(2, 15)}`;

                await Mamiferos.update(
                    { nombre_ingles: temporalName },
                    { where: { id_mamifero: idRegistro } }
                );

                await Mamiferos.update(
                    { nombre_ingles: ingles },
                    { where: { id_mamifero: idRegistro } }
                );

                delete cambiosFiltrados.nombre_ingles;
            }

            // Actualizar el registro existente en la tabla "Mamiferos" y sus relaciones
            await Mamiferos.update(cambiosFiltrados, {
                where: {
                    id_mamifero: idRegistro,
                },
            });
        }
        // console.log(urlImagen)
        for (const imageUrl of urlImagen) {
            await Imagenes_mamiferos.create({
                mamiferos_id_mamifero: idRegistro,
                url_mamifero: imageUrl,
            });
        }

        const existingRelations = await Mamiferos.findByPk(idRegistro);
        if (existingRelations) {
            // Elimina todas las relaciones de países asociadas al registro
            await existingRelations.setPaises([]);
            await existingRelations.setZonasMamiferos([]);
        }

        for (const pais of paises) {
            await existingRelations.addPaises(pais.id);
        }

        for (const zonita of zona) {
            await existingRelations.addZonasMamiferos(zonita.id);
        }

        return "El registro se ha actualizado correctamente.";
    } catch (error) {
        console.log('Error:', error);
        // Agrega manejo de errores específicos si es necesario.
    }
};

const findPhotosId = async (imgsIds) => {
    try {
        await Imagenes_mamiferos.destroy({ where: { id: imgsIds } });
        return 'Las fotografías se han borrado exitosamente'
    } catch (error) {
        console.error('Error al buscar fotos por ID de registro:', error);
        throw error;
    }
};


const setDbCover = async (idFoto, idRegistro) => {
    try {
        // Buscar todas las imágenes asociadas al registro
        const imag = await Imagenes_mamiferos.findAll({ where: { mamiferos_id_mamifero: idRegistro } });
        // Encontrar la imagen destacada actual, si la hay
        const imagenDestacadaActual = imag.find((imagen) => imagen.destacada === true);
        // Desmarcar la imagen destacada actual, si la hay
        if (imagenDestacadaActual) {
            await imagenDestacadaActual.update({ destacada: null });
        }
        // Marcar la nueva imagen como destacada
        const imagenNuevaDestacada = await Imagenes_mamiferos.findByPk(idFoto);
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
        const allRegistros = await Mamiferos.count();
        const allEnglish = await Mamiferos.count({
            where: {
                nombre_ingles: {
                    [Sequelize.Op.not]: null, // El nombre en inglés no es nulo
                    [Sequelize.Op.not]: ''    // El nombre en inglés no está vacío
                }
            }
        });
        const allCientifico = await Mamiferos.count({
            where: {
                nombre_cientifico: {
                    [Sequelize.Op.not]: null, // El nombre en inglés no es nulo
                    [Sequelize.Op.not]: ''    // El nombre en inglés no está vacío
                }
            }
        });
        const allComun = await Mamiferos.count({
            where: {
                nombre_comun: {
                    [Sequelize.Op.not]: null, // El nombre en inglés no es nulo
                    [Sequelize.Op.not]: ''    // El nombre en inglés no está vacío
                }
            }
        });
        // const withoutContry = await Mamiferos.count({
        //     where: {
        //         [Sequelize.Op.not]: Sequelize.literal('EXISTS (SELECT 1 FROM mamiferos_has_paises WHERE Mamiferos.id_mamifero = mamiferos_has_paises.mamiferos_id_mamifero)'),
        //     },
        // })
        const allCountrys = await Paises.count({
            distinct: true,
            col: 'id_pais', // Ajusta según el nombre real de la columna en tu modelo
            include: [{
                model: Mamiferos,
                through: 'mamiferos_has_paises',
                attributes: [], // Evita recuperar todos los atributos de la relación
                required: true, // Utiliza una inner join para asegurar que solo obtengas registros que tengan relaciones en mamiferos_has_paises
            }],
        });

        const allGrupos = await Grupos_mamiferos.count();
        const allFamilias = await Familias_mamiferos.count()
        const allZonas = await Zonas.count({
            distinct: true,
            col: 'id_zona', // Ajusta según el nombre real de la columna en tu modelo
            include: [{
                model: Mamiferos,
                through: 'mamiferos_has_zonas',
                as: 'zoMamiferos',
                attributes: [], // Evita recuperar todos los atributos de la relación
                required: true, // Utiliza una inner join para asegurar que solo obtengas registros que tengan relaciones en mamiferos_has_paises
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
        const imagenes = await Imagenes_mamiferos.findAll({
            where: {
                mamiferos_id_mamifero: idRegistro,
            },
        });
        // console.log(imagenes)
        const ftpDeleteResults = await deletePhotoFromFTPMamiferos(imagenes.map(imagen => imagen.url_mamifero));

        if (!ftpDeleteResults.success) {
            // Si hay un problema al borrar las fotos del FTP, puedes manejar el error aquí
            throw new Error("Error al borrar las fotos del FTP.");
        }

        // Buscar imágenes en la base de datos después de eliminarlas del FTP
        const remainingImages = await Imagenes_mamiferos.findAll({
            where: {
                mamiferos_id_mamifero: idRegistro,
            },
        });

        // Eliminar las imágenes de la base de datos si aún existen
        await Promise.all(remainingImages.map(async (imagen) => {
            await imagen.destroy();
        }));


        // Eliminar las relaciones y la registro
        const existingRelations = await Mamiferos.findByPk(idRegistro);
        if (!existingRelations) {
            throw new Error("La registro con el ID especificado no existe.");
        }

        await existingRelations.setPaises([]);
        await existingRelations.setZonasMamiferos([]);
        await existingRelations.setImagenes_mamiferos([]);

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
        const existingRelations = await Mamiferos.findAll({
            where: {
                nombre_ingles: nombre
            }
        });

        // Si encuentra Mamiferos con el mismo nombre, arroja un error
        if (existingRelations.length > 0) {
            throw new Error("Este Nombre en Inglés ya existe.");
        }

        // Si no encuentra Mamiferos con el mismo nombre, simplemente retorna
        return "Nombre en Inglés disponible.";

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const findAllEnglishNames = async () => {
    try {
        const registros = await Mamiferos.findAll({
            attributes: ['nombre_ingles', 'id_mamifero'], // Only fetches the 'nombre_ingles' attribute
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
        if (idfamilia) {
            // Buscar todas las aves con el id_familia dado
            const aves = await Mamiferos.findAll({
                where: {
                    familias_id_familia: idfamilia
                },
                attributes: ['grupos_id_grupo'], // Solo necesitamos los id_grupo
                group: ['grupos_id_grupo'] // Agrupar por id_grupo para evitar duplicados
            });

            // Extraer los id_grupo de las aves
            const idGrupos = aves.map(registro => registro.grupos_id_grupo);

            // Buscar los grupos con los id_grupo obtenidos
            const grupos = await Grupos_mamiferos.findAll({
                where: {
                    id_grupo: {
                        [Op.in]: idGrupos
                    }
                },
                attributes: [['id_grupo', 'id'], 'nombre']
            });

            return { grupos };
        } else if (idgrupo) {
            // Buscar las aves con el id_grupo dado
            const aves = await Mamiferos.findAll({
                where: {
                    grupos_id_grupo: idgrupo
                },
                attributes: ['familias_id_familia'], // Solo necesitamos los id_familia
                group: ['familias_id_familia'] // Agrupar por id_familia para evitar duplicados
            });

            // Extraer los id_familia de las aves
            const idFamilias = aves.map(registro => registro.familias_id_familia);

            // Buscar las familias con los id_familia obtenidos
            const familias = await Familias_mamiferos.findAll({
                where: {
                    id_familia: {
                        [Op.in]: idFamilias
                    }
                },
                attributes: [['id_familia', 'id'], 'nombre']
            });

            return { familias };
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

const findGroupNameDuplicate = async (nombreGrupo) => {
    // console.log(nombreGrupo)
    try {
        const existingGroups = await Grupos_mamiferos.findAll({
            where: {
                nombre: nombreGrupo
            }
        });

        // Si encuentra grupos con el mismo nombre, arroja un error
        if (existingGroups.length > 0) {
            throw new Error("Este Nombre de Genero ya existe.");
        }

        // Si no encuentra grupos con el mismo nombre, simplemente retorna
        return "Nombre de Genero disponible.";

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const findFamilyNameDuplicate = async (nombreFamilia) => {
    try {
        const existingFamilies = await Familias_mamiferos.findAll({
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

module.exports = {
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
    findAllEnglishNames
};
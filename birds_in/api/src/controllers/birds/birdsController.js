const { Op, Sequelize } = require("sequelize");
const { Aves, Grupos, Familias, Paises, Imagenes_aves, Zonas, VistaAvesOrdenadaAll } = require('../../config/db/db');
const mapFieldValues = require('../../utils/mapOptions');
const { obtenerIdDePais, obtenerIdDeZonas } = require("../../utils/OptionsZonaPais");
const { deletePhotoFromFTP } = require("../../services/deletFtp");

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
        { model: Grupos, as: 'grupo', attributes: ['nombre'] },
        { model: Familias, as: 'familia', attributes: ['nombre'] },
        {
            model: Paises, // El mismo alias que en la definición de la asociación
            attributes: ['nombre', 'id_pais'],
            through: {
                attributes: []
            }
        },
        {
            model: Zonas,
            as: 'zonasAves', // El mismo alias que en la definición de la asociación
            attributes: [['nombre_zona', 'nombre'], 'id_zona'],
            through: {
                attributes: ['zonas_id_zona']
            }
        },
        {
            model: Imagenes_aves,
            as: 'imagenes_aves',
            attributes: ['url', 'destacada']
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
        as: 'zonasAves',
        attributes: ['nombre_zona', 'id_zona'],
        through: {
            attributes: [],
        },
        where: {
            id_zona: zonas,
        },
    };
};

const fetchFilterBirds = async (familia, grupo, nombreCientifico, nombreIngles, pais, zonas, page, perPage) => {
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

        const avesFiltradas = await Aves.findAll({
            where: whereClause,
            include: includeArr,
            limit: perPageConvert,
            offset: offset,
            order: [['nombre_ingles', 'ASC']],
        });

        let totalResultsCount;
        if (pais && zonas) {
            totalResultsCount = await Aves.count({
                where: whereClause,
                include: [buildIncludeForPais(pais), buildIncludeForZonas(zonas)]
            });
        } else if (pais) {
            totalResultsCount = await Aves.count({
                where: whereClause,
                include: [buildIncludeForPais(pais)]
            });
        } else if (zonas) {
            totalResultsCount = await Aves.count({
                where: whereClause,
                include: [buildIncludeForZonas(zonas)]
            });
        } else {
            totalResultsCount = await Aves.count({ where: whereClause });
        }

        const totalPages = Math.ceil(totalResultsCount / perPageConvert);
        const isLastPage = totalResultsCount <= 8 || pageConvert >= totalPages;

        return { avesFiltradas, totalResultsCount, isLastPage };
    } catch (error) {
        console.error('Ocurrió un error al realizar la consulta:', error);
        throw new Error('Error al realizar la consulta de aves');
    }
};



// const DEFAULT_PER_PAGE = 18;
// const DEFAULT_PAGE = 1;
// const fetchFilterBirds = async (
//     familia,
//     grupo,
//     nombreCientifico,
//     nombreIngles,
//     pais,
//     zonas,
//     page,
//     perPage
// ) => {
//     try {
//         if (nombreCientifico) {
//             nombreCientifico = decodeURIComponent(nombreCientifico)
//         }
//         if (nombreIngles) {
//             nombreIngles = decodeURIComponent(nombreIngles);
//         }
//         const whereClause = {};
//         if (familia) {
//             whereClause.familias_id_familia = familia;
//         }
//         if (grupo) {
//             const grupoArray = grupo.split(',').map(Number);
//             whereClause.grupos_id_grupo = grupoArray;
//         }
//         if (nombreCientifico) {
//             whereClause.nombre_cientifico = { [Op.like]: `%${nombreCientifico}%` };
//         }
//         if (nombreIngles) {
//             whereClause.nombre_ingles = { [Op.like]: `%${nombreIngles}%` };
//         }


//         const includeArr = [
//             { model: Grupos, as: 'grupo', attributes: ['nombre'] },
//             { model: Familias, as: 'familia', attributes: ['nombre'] },
//             {
//                 model: Paises, // El mismo alias que en la definición de la asociación
//                 attributes: ['nombre', 'id_pais'],
//                 through: {
//                     attributes: []
//                 }
//             },
//             {
//                 model: Imagenes_aves,
//                 as: 'imagenes_aves',
//                 attributes: ['url', 'destacada']
//             },
//             {
//                 model: Zonas,
//                 as: 'zonasAves', // El mismo alias que en la definición de la asociación
//                 attributes: [['nombre_zona', 'nombre'], 'id_zona'],
//                 through: {
//                     attributes: ['zonas_id_zona']
//                 }
//             },
//         ];
//         if (pais) {
//             includeArr.push({
//                 model: Paises,
//                 attributes: ['nombre', 'id_pais'],
//                 through: {
//                     attributes: [],
//                 },
//                 where: { id_pais: pais }
//             });
//         }
//         if (zonas) {
//             includeArr.push({
//                 model: Zonas,
//                 as: 'zonasAves',
//                 attributes: ['nombre_zona', 'id_zona'],
//                 through: {
//                     attributes: [],
//                 },
//                 where: {
//                     id_zona: zonas, // Filtra por el id_zona proporcionado
//                 },

//             });
//         }

//         const pageConvert = Number(page) || DEFAULT_PAGE;
//         const perPageConvert = perPage === '0' ? undefined : Number(perPage) || DEFAULT_PER_PAGE;
//         const offset = perPageConvert ? (pageConvert - 1) * perPageConvert : 0;
//         const avesFiltradas = await Aves.findAll({
//             where: whereClause,
//             include: includeArr,
//             limit: perPageConvert,
//             offset: offset,
//             order: [
//                 ['nombre_ingles', 'ASC'], // Ordena por el campo 'nombre_ingles' en orden ascendente
//             ],
//         });

//         const totalResultsClausula = await Aves.count({ where: whereClause });
//         const totalResults = avesFiltradas.length
//         // const isLastPage = (pageConvert * perPageConvert) >= totalResultsClausula;
//         // const isLastPage = offset + totalResultsClausula >= totalResults;
//         const totalPages = Math.ceil(totalResultsClausula / perPageConvert); // Calcular el total de páginas
//         const isLastPage = totalResults <= 8 || pageConvert >= totalPages; // Verificar si estás en la última página
//         return { avesFiltradas, totalResultsClausula, isLastPage };
//     } catch (error) {
//         console.error('Ocurrió un error al realizar la consulta:', error);
//         throw error; // Lanza la excepción para que pueda ser capturada en el lugar desde donde se llama la función.
//     }
// };

const fetchOptions = async () => {
    const optionsGrupos = await Grupos.findAll({
        attributes: ['nombre', ['id_grupo', 'id']],
        order: [['nombre', 'ASC']]
    });
    const optionsFamilias = await Familias.findAll({
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
    const optionsNames = await Aves.findAll({
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
    const allResults = await fetchFilterBirds(
        grupo,
        familia,
        pais,
        nombreIngles,
        nombreCientifico,
        zonas,
        page,
        perpage)
// console.log(allResults)
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
    // console.log(allResults)
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
    // console.log(allResults.avesFiltradas.paises)
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

const sendAndCreateBird = async (
    grupo,
    familia,
    paises,
    zona,
    cientifico,
    ingles,
    comun,
    urlBird,
    urlWiki,
    urlImagen
) => {
    try {
        // Verificar si el nombre en inglés está presente (obligatorio)
        if (!ingles) {
            throw new Error('El nombre en inglés es obligatorio.');
        }
        // Aplicar conversiones solo si los datos opcionales están presentes
        // const converIngles = ingles ? ingles.charAt(0).toUpperCase() + ingles.slice(1).toLowerCase() : null;
        const converCientifico = cientifico ? cientifico.charAt(0).toUpperCase() + cientifico.slice(1).toLowerCase() : null;
        const converComun = comun ? comun.charAt(0).toUpperCase() + comun.slice(1).toLowerCase() : null;
        // const converZona = zona ? zona.charAt(0).toUpperCase() + zona.slice(1).toLowerCase() : null;
        const imagenesAvesData = urlImagen.map((imageUrl) => {
            return {
                url: imageUrl,
            };
        });
        // Crear un nuevo registro en la tabla "aves" solo si el nombre en inglés está presente
        if (ingles) {
            const createNewBird = await Aves.create({
                nombre_ingles: ingles,
                nombre_cientifico: converCientifico,
                nombre_comun: converComun,
                url_wiki: urlWiki,
                url_bird: urlBird,
                grupos_id_grupo: grupo.id,
                familias_id_familia: familia.id,
                imagenes_aves: imagenesAvesData
            }, {
                include: Imagenes_aves,
            });
            for (const pais of paises) {
                await createNewBird.addPaises(pais.id);
            }
            for (const zonas of zona) {
                await createNewBird.addZonasAves(zonas.id);
            }
            // Busca el ave recién creada por el nombre en inglés
            const createdBird = await Aves.findOne({
                where: {
                    nombre_ingles: ingles
                },

            });
            return { message: "El ave se ha creado correctamente.", bird: createdBird };
        } else {
            return { message: "El nombre en inglés es obligatorio.", bird: null };
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
        const ave = await Aves.findOne({
            where: { id_ave: id },
            include: [
                {
                    model: Imagenes_aves,
                    attributes: ['url',
                        'id',
                        'destacada',
                        [Sequelize.literal('SUBSTRING_INDEX(url, "_", -1)'), 'titulo']
                        ,] // Atributos que deseas de Imagenes_aves
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
                    as: 'zonasAves',
                    attributes: [['nombre_zona', 'nombre'], ['id_zona', 'id']],
                    through: {
                        attributes: [],
                    }, // Atributos que deseas de Paises
                },
                { model: Grupos, attributes: ['nombre', ['id_grupo', 'id']] },
                { model: Familias, attributes: ['nombre', ['id_familia', 'id']] },
            ],
            attributes: [
                'id_ave',
                'nombre_ingles',
                'nombre_cientifico',
                'nombre_comun',
                'url_wiki',
                'url_bird',] // Atributos de Aves que deseas
        });
        return ave;
    } catch (error) {
        // Manejar errores de consulta
        console.error('Error en la consulta:', error);
        throw error;
    }
};


const findDataByName = async (name) => {
    try {
        const ave = await Aves.findOne({
            where: { nombre_ingles: name },
            include: [
                {
                    model: Imagenes_aves,
                    attributes: ['url',
                        'id',
                        'destacada',
                        [Sequelize.literal('SUBSTRING_INDEX(url, "_", -1)'), 'titulo']
                        ,] // Atributos que deseas de Imagenes_aves
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
                    as: 'zonasAves',
                    attributes: [['nombre_zona', 'nombre'], ['id_zona', 'id']],
                    through: {
                        attributes: [],
                    }, // Atributos que deseas de Paises
                },
                { model: Grupos, attributes: ['nombre', ['id_grupo', 'id']] },
                { model: Familias, attributes: ['nombre', ['id_familia', 'id']] },
            ],
            attributes: [
                'id_ave',
                'nombre_ingles',
                'nombre_cientifico',
                'nombre_comun',
                'url_wiki',
                'url_bird',] // Atributos de Aves que deseas
        });
        return ave;
    } catch (error) {
        // Manejar errores de consulta
        console.error('Error en la consulta:', error);
        throw error;
    }
};


const sendAndUpdateBird = async (
    grupo,
    familia,
    paises,
    zona,
    cientifico,
    ingles,
    comun,
    urlWiki,
    urlBird,
    urlImagen,
    idAve,
) => {
    try {
        // Obtener el ave existente de la base de datos
        const existingBird = await Aves.findOne({
            where: {
                id_ave: idAve,
            },
        });

        if (!existingBird) {
            throw new Error("El ave con ID especificado no existe.");
        }

        // Verificar si los nuevos valores son diferentes de los actuales antes de actualizar
        const cambios = {
            nombre_ingles: ingles !== existingBird.nombre_ingles ? ingles : undefined,
            nombre_cientifico: cientifico !== existingBird.nombre_cientifico ? cientifico : undefined,
            nombre_comun: comun !== existingBird.nombre_comun ? comun : undefined,
            url_wiki: urlWiki !== existingBird.url_wiki ? urlWiki : undefined,
            url_bird: urlBird !== existingBird.url_bird ? urlBird : undefined,
            grupos_id_grupo: grupo.id !== existingBird.grupos_id_grupo ? grupo.id : undefined,
            familias_id_familia: familia.id !== existingBird.familias_id_familia ? familia.id : undefined,
        };

        // Filtrar valores undefined
        const cambiosFiltrados = Object.fromEntries(Object.entries(cambios).filter(([key, value]) => value !== undefined));

        if (Object.keys(cambiosFiltrados).length > 0) {
            // Si nombre_ingles es diferente, hacer el cambio en dos pasos
            if (cambiosFiltrados.nombre_ingles) {
                const temporalName = `temp_${Math.random().toString(36).substring(2, 15)}`;

                await Aves.update(
                    { nombre_ingles: temporalName },
                    { where: { id_ave: idAve } }
                );

                await Aves.update(
                    { nombre_ingles: ingles },
                    { where: { id_ave: idAve } }
                );

                delete cambiosFiltrados.nombre_ingles;
            }

            // Actualizar el registro existente en la tabla "aves" y sus relaciones
            await Aves.update(cambiosFiltrados, {
                where: {
                    id_ave: idAve,
                },
            });
        }

        for (const imageUrl of urlImagen) {
            await Imagenes_aves.create({
                aves_id_ave: idAve,
                url: imageUrl,
            });
        }

        const existingRelations = await Aves.findByPk(idAve);
        if (existingRelations) {
            // Elimina todas las relaciones de países asociadas al ave
            await existingRelations.setPaises([]);
            await existingRelations.setZonasAves([]);
        }

        for (const pais of paises) {
            await existingRelations.addPaises(pais.id);
        }

        for (const zonita of zona) {
            await existingRelations.addZonasAves(zonita.id);
        }

        return "El ave se ha actualizado correctamente.";
    } catch (error) {
        console.log('Error:', error);
        // Agrega manejo de errores específicos si es necesario.
    }
};

const findPhotosId = async (imgsIds) => {
    try {
        await Imagenes_aves.destroy({ where: { id: imgsIds } });
        return 'Las fotografías se han borrado exitosamente'
    } catch (error) {
        console.error('Error al buscar fotos por ID de ave:', error);
        throw error;
    }
};


const setDbCover = async (idFoto, idAve) => {
    try {
        // Buscar todas las imágenes asociadas al ave
        const imagenesAve = await Imagenes_aves.findAll({ where: { aves_id_ave: idAve } });
        // Encontrar la imagen destacada actual, si la hay
        const imagenDestacadaActual = imagenesAve.find((imagen) => imagen.destacada === true);
        // Desmarcar la imagen destacada actual, si la hay
        if (imagenDestacadaActual) {
            await imagenDestacadaActual.update({ destacada: null });
        }
        // Marcar la nueva imagen como destacada
        const imagenNuevaDestacada = await Imagenes_aves.findByPk(idFoto);
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

const findNameDuplicate = async (nombre) => {
    try {
        const existingRelations = await Aves.findAll({
            where: {
                nombre_ingles: nombre
            }
        });

        // Si encuentra aves con el mismo nombre, arroja un error
        if (existingRelations.length > 0) {
            throw new Error("Este Nombre en Inglés ya existe.");
        }

        // Si no encuentra aves con el mismo nombre, simplemente retorna
        return "Nombre en Inglés disponible.";

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

module.exports = {
    fetchOptions,
    filterOptions,
    fetchFilterBirds,
    sendAndCreateBird,
    findDataById,
    sendAndUpdateBird,
    findPhotosId,
    setDbCover,
    getContadores,
    filterOptionsPaisZonas,
    deleteBirdDb,
    findDataByName,
    findNameDuplicate,
};
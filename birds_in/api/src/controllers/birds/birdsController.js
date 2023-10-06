const { Op, Utils, Sequelize } = require("sequelize");
const { Aves, Grupos, Familias, Paises, Imagenes_aves } = require('../../db/db');
const mapFieldValues = require('../../utils/mapOptions');

const DEFAULT_PER_PAGE = 9;
const DEFAULT_PAGE = 1;

const fetchFilterBirds = async (
    familia,
    grupo,
    nombreCientifico,
    nombreIngles,
    pais,
    zonasNombre,
    page,
    perPage
) => {

    if (nombreCientifico) {
        nombreCientifico = decodeURIComponent(nombreCientifico)
    }
    if (nombreIngles) {
        nombreIngles = decodeURIComponent(nombreIngles);
    }

    if (zonasNombre) {
        zonasNombre = decodeURIComponent(zonasNombre);
    }
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
    if (zonasNombre) {
        whereClause.zonas = { [Op.like]: `%${zonasNombre}%` };
    }

    const includeArr = [
        { model: Grupos, as: 'grupo', attributes: ['nombre'] },
        { model: Familias, as: 'familia', attributes: ['nombre'] },
        {
            model: Paises,
            as: 'paises', // El mismo alias que en la definición de la asociación
            attributes: ['nombre', 'id_pais'],
            through: {
                attributes: []
            }
        },
        {
            model: Imagenes_aves,
            as: 'imagenes_aves',
            attributes: ['url']
        }
    ];

    if (pais) {
        includeArr.push({
            model: Paises,
            as: 'paises',
            attributes: ['nombre', 'id_pais'],
            through: {
                attributes: [],
            },
            where: { id_pais: pais }
        });
    }
    const pageConvert = Number(page) || DEFAULT_PAGE;
    const perPageConvert = perPage === '0' ? undefined : Number(perPage) || DEFAULT_PER_PAGE;
    const offset = perPageConvert ? (pageConvert - 1) * perPageConvert : 0;


    const avesFiltradas = await Aves.findAll({
        where: whereClause,
        include: includeArr,
        limit: perPageConvert,
        offset: offset,
    });

    return avesFiltradas

};

const fetchOptions = async () => {

    const optionsGrupos = await Grupos.findAll({
        attributes: ['nombre', 'id_grupo'],
    });
    const optionsFamilias = await Familias.findAll({
        attributes: ['nombre', 'id_familia']
    })
    const optionsPaises = await Paises.findAll({
        attributes: [
            'id_pais',
            [Sequelize.literal(`CONCAT(UPPER(LEFT(nombre, 1)), LOWER(SUBSTRING(nombre, 2)))`), 'nombre'],
        ],
    });
    const optionsNames = await Aves.findAll({
        attributes: ['nombre_cientifico', 'nombre_ingles', 'zonas']

    })

    const nombresGrupos = mapFieldValues(optionsGrupos, 'nombre', 'id_grupo')
    const nombreFamilias = mapFieldValues(optionsFamilias, 'nombre', 'id_familia')
    const nombrePaises = mapFieldValues(optionsPaises, 'nombre', 'id_pais')
    const nombreIngles = mapFieldValues(optionsNames, 'nombre_ingles')
    const nombreCientifico = mapFieldValues(optionsNames, 'nombre_cientifico')
    const nombrezonas = mapFieldValues(optionsNames, 'zonas')

    return {
        grupos: nombresGrupos,
        familias: nombreFamilias,
        paises: nombrePaises,
        nIngles: nombreIngles,
        nCientifico: nombreCientifico,
        zonas: nombrezonas
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

    allResults.forEach(ave => {
        gruposSet.add(JSON.stringify({
            id: ave.dataValues.grupos_id_grupo,
            nombre: ave.grupo.dataValues.nombre
        }));
    });

    const gruposArray = Array.from(gruposSet).map(grupo => JSON.parse(grupo));
    newOptions.grupos = gruposArray

    const familiasSet = new Set();

    allResults.forEach(ave => {
        familiasSet.add(JSON.stringify({
            id: ave.dataValues.familias_id_familia,
            nombre: ave.familia.dataValues.nombre
        }));
    });

    const familiasArray = Array.from(familiasSet).map(item => JSON.parse(item));
    newOptions.familias = familiasArray;

    const paisesSet = new Set();

    allResults.forEach(ave => {
        ave.paises.forEach(pais => paisesSet.add(JSON.stringify({
            id: pais.dataValues.id_pais,
            nombre: pais.dataValues.nombre
        })));
    });

    newOptions.paises = Array.from(paisesSet).map(pais =>
        JSON.parse(pais));

    const nombresCientificos = [...new Set(allResults.map(ave => ({ id: ave.id_ave, nombre: ave.dataValues.nombre_cientifico })))];
    newOptions.nCientifico = nombresCientificos;

    const nombresIngles = [...new Set(allResults.map(ave => ({ id: ave.id_ave, nombre: ave.dataValues.nombre_ingles })))];
    newOptions.nIngles = nombresIngles;

    const listaZona = [...new Set(allResults.map(ave => ({ id: ave.id_ave, nombre: ave.dataValues.zonas })))];
    newOptions.zonas = listaZona;

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
        const converIngles = ingles ? ingles.charAt(0).toUpperCase() + ingles.slice(1).toLowerCase() : null;
        const converCientifico = cientifico ? cientifico.charAt(0).toUpperCase() + cientifico.slice(1).toLowerCase() : null;
        const converComun = comun ? comun.charAt(0).toUpperCase() + comun.slice(1).toLowerCase() : null;
        const converZona = zona ? zona.charAt(0).toUpperCase() + zona.slice(1).toLowerCase() : null;
        const imagenesAvesData = urlImagen.map((imageUrl) => {
            return {
                url: imageUrl,
            };
        });
        // Crear un nuevo registro en la tabla "aves" solo si el nombre en inglés está presente
        if (converIngles) {
            const createNewBird = await Aves.create({
                nombre_ingles: converIngles,
                nombre_cientifico: converCientifico,
                nombre_comun: converComun,
                zonas: converZona,
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

            return "El ave se ha creado correctamente.";
        } else {
            return "El nombre en inglés es obligatorio.";
        }
    } catch (error) {
        // A continuación, puedes agregar lógica para manejar errores específicos si es necesario.
        console.error('Error en la consulta:', error);
        throw error;
    }
};

const findDataById = async (id) => {
    try {
        const ave = await Aves.findOne({
            where: { id_ave: id },
            include: [
                {
                    model: Imagenes_aves,
                    attributes: ['url', 'id'] // Atributos que deseas de Imagenes_aves
                },
                {
                    model: Paises,
                    attributes: ['nombre', ['id_pais', 'id']],
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
                'zonas',
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
        })

        if (!existingBird) {
            throw new Error("El ave con ID especificado no existe.");
        }


        // Verificar si los nuevos valores son diferentes de los actuales antes de actualizar
        if (
            ingles !== existingBird.nombre_ingles ||
            cientifico !== existingBird.nombre_cientifico ||
            comun !== existingBird.nombre_comun ||
            zona !== existingBird.zonas ||
            urlWiki !== existingBird.url_wiki ||
            urlBird !== existingBird.url_bird ||
            grupo.id !== existingBird.grupos_id_grupo ||
            familia.id !== existingBird.familias_id_familia
        ) {
            // Actualizar el registro existente en la tabla "aves" y sus relaciones
            await Aves.update(
                {
                    nombre_ingles: ingles,
                    nombre_cientifico: cientifico,
                    nombre_comun: comun,
                    zonas: zona,
                    url_wiki: urlWiki,
                    url_bird: urlBird,
                    grupos_id_grupo: grupo.id,
                    familias_id_familia: familia.id,
                },
                {
                    where: {
                        id_ave: idAve,
                    },
                }
            );
        }

        for (const imageUrl of urlImagen) {
            await Imagenes_aves.create({
                aves_id_ave: idAve,
                url: imageUrl,
            });
        }
        // }
        const existingRelations = await Aves.findByPk(idAve);

        if (existingRelations) {
            // Obtén todas las relaciones de países asociadas al ave
            const existingPaises = await existingRelations.getPaises();

            // Itera sobre las relaciones y elimina cada una de ellas
            for (const pais of existingPaises) {
                await existingRelations.removePaises(pais);
            }
        }

        for (const pais of paises) {
            await existingRelations.addPaises(pais.id);
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


module.exports = {
    fetchOptions,
    filterOptions,
    fetchFilterBirds,
    sendAndCreateBird,
    findDataById,
    sendAndUpdateBird,
    findPhotosId
}
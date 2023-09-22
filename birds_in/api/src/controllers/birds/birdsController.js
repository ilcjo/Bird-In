const { Op, Utils } = require("sequelize");
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
        attributes: ['nombre', 'id_pais']
    })
    const optionsNames = await Aves.findAll({
        attributes: ['nombre_cientifico', 'nombre_ingles']

    })
    const nombresGrupos = mapFieldValues(optionsGrupos, 'nombre', 'id_grupo')
    const nombreFamilias = mapFieldValues(optionsFamilias, 'nombre', 'id_familia')
    const nombrePaises = mapFieldValues(optionsPaises, 'nombre', 'id_pais')
    const nombreIngles = mapFieldValues(optionsNames, 'nombre_ingles')
    const nombreCientifico = mapFieldValues(optionsNames, 'nombre_cientifico')
    const zonasLista = mapFieldValues(optionsNames, 'zonas')

    return {
        grupos: nombresGrupos,
        familias: nombreFamilias,
        paises: nombrePaises,
        zonas: zonasLista,
        nIngles: nombreIngles,
        nCientifico: nombreCientifico
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
    urlBird,
    urlWiki,
    urlImagen
) => {
    try {

        const converIngles = ingles.charAt(0).toUpperCase() + ingles.slice(1).toLowerCase();
        const converCientifico = cientifico.charAt(0).toUpperCase() + cientifico.slice(1).toLowerCase();
        const converZona = zona.charAt(0).toUpperCase() + zona.slice(1).toLowerCase();

        // Crear un nuevo registro en la tabla "aves" y relacionarlo con los registros auxiliares
        const createNewBird = await Aves.create({
            nombre_ingles: converIngles,
            nombre_cientifico: converCientifico,
            zonas: converZona,
            url_wiki: urlWiki,
            url_bird: urlBird,
            grupos_id_grupo: grupo.id,
            familias_id_familia: familia.id,
            imagenes_aves: [ // Define la relación con Imagenes_aves y crea la imagen en la misma consulta
                {
                    url: urlImagen,
                },
            ],
        }, {
            include: Imagenes_aves, // Incluye la tabla Imagenes_aves en la consulta
        });

        for (const pais of paises) {
            await createNewBird.addPaises(pais.id);
        }


        return "El ave se ha creado correctamente.";
        // Obtener todos los países asociados a un ave específico
        // const paisesAsociados = await createNewBird.getPaises();
        // console.log(paisesAsociados)
        // console.log(createNewBird);

    } catch (error) {
        // Error: Captura cualquier excepción que se produzca durante la ejecución
        console.error('Error:', error);

        // A continuación, puedes agregar lógica para manejar errores específicos si es necesario.
        if (error.name === 'SequelizeValidationError') {
            // Handle validation errors (e.g., required fields, unique constraints)
            console.error('Errores de validación:', error.errors);
        } else if (error.name === 'SequelizeUniqueConstraintError') {
            // Handle unique constraint violations
            console.error('Violación de restricción única:', error.errors);
        } else if (error.name === 'SequelizeForeignKeyConstraintError') {
            // Handle foreign key constraint violations
            console.error('Violación de restricción de clave foránea:', error.parent);
        } else {
            // Handle other types of errors
            console.error('Error no manejado:', error);
        }
    }
};

const findDataById = async (id) => {
    console.log('dentro dle controler', id)
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
                { model: Familias, attributes: ['nombre',['id_familia', 'id']] },
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
    urlBird,
    urlWiki,
    aveId,
    urlImagen
) => {
    try {
        // Obtener el ave existente de la base de datos
        const existingBird = await Aves.findOne({
            where: {
                id_ave: aveId,
            },
        });

        if (!existingBird) {
            throw new Error("El ave con ID especificado no existe.");
        }

        // Comparar los nuevos valores con los valores actuales
        const converIngles = ingles.charAt(0).toUpperCase() + ingles.slice(1).toLowerCase();
        const converCientifico = cientifico.charAt(0).toUpperCase() + cientifico.slice(1).toLowerCase();
        const converZona = zona.charAt(0).toUpperCase() + zona.slice(1).toLowerCase();

        // Verificar si los nuevos valores son diferentes de los actuales antes de actualizar
        if (
            converIngles !== existingBird.nombre_ingles ||
            converCientifico !== existingBird.nombre_cientifico ||
            converZona !== existingBird.zonas ||
            urlWiki !== existingBird.url_wiki ||
            urlBird !== existingBird.url_bird ||
            grupo.id !== existingBird.grupos_id_grupo ||
            familia.id !== existingBird.familias_id_familia
        ) {
            // Actualizar el registro existente en la tabla "aves" y sus relaciones
            await Aves.update(
                {
                    nombre_ingles: converIngles,
                    nombre_cientifico: converCientifico,
                    zonas: converZona,
                    url_wiki: urlWiki,
                    url_bird: urlBird,
                    grupos_id_grupo: grupo.id,
                    familias_id_familia: familia.id,
                },
                {
                    where: {
                        id_ave: aveId,
                    },
                }
            );
        }

        // Actualizar las imágenes del ave (esto dependerá de cómo esté estructurada tu base de datos)
        await Imagenes_aves.destroy({
            where: {
                aves_id_ave: aveId,
            },
        });

        // Crear nuevas imágenes asociadas al ave actualizado
        // for (const imageUrl of urlImagen) {
        await Imagenes_aves.create({
            aves_id_ave: aveId,
            url: urlImagen,
        });
        // }
        const existingRelations = await Aves.findByPk(aveId);

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
        console.error('Error:', error);
        // Agrega manejo de errores específicos si es necesario.
    }
};



module.exports = {
    fetchOptions,
    filterOptions,
    fetchFilterBirds,
    sendAndCreateBird,
    findDataById,
    sendAndUpdateBird,
}
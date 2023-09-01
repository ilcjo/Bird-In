const { Op } = require("sequelize");
const { Aves, Grupos, Familias, Paises } = require('../../db/db');
const mapFieldValues = require('../../utils/mapOptions');


const DEFAULT_PER_PAGE = 9;
const DEFAULT_PAGE = 1;

const fetchFilterBirds = async (familia, grupo, nombreCientifico, nombreIngles, pais, page, perPage) => {
    if (nombreCientifico) {
        nombreCientifico = decodeURIComponent(nombreCientifico);
    }
    if (nombreIngles) {
        nombreIngles = decodeURIComponent(nombreIngles);
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

    const includeArr = [
        { model: Grupos, as: 'grupo', attributes: ['nombre'] },
        { model: Familias, as: 'familia', attributes: ['nombre'] },
        {
            model: Paises,
            as: 'paises', // El mismo alias que en la definición de la asociación
            attributes: ['nombre'],
            through: {
                attributes: []
            }
        }
    ];

    if (pais) {
        includeArr.push({
            model: Paises,
            as: 'paises',
            attributes: ['nombre'],
            through: {
                attributes: [],
            },
            where: { id_pais: pais }
        });
    }
    const pageConvert = Number(page) || DEFAULT_PAGE;
    const perPageConvert = Number(perPage) || DEFAULT_PER_PAGE;
    const offset = (pageConvert - 1) * perPageConvert;

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
    return {
        grupos: nombresGrupos,
        familias: nombreFamilias,
        paises: nombrePaises,
        nIngles: nombreIngles,
        nCientifico: nombreCientifico
    }
};

const filterOptions = async ( grupo, familia, pais, nombreIngles, nombreCientifico, ) => {

    if (nombreCientifico) {
        nombreCientifico = decodeURIComponent(nombreCientifico);
    }
    if (nombreIngles) {
        nombreIngles = decodeURIComponent(nombreIngles);
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
        whereClause.nombre_cientifico = nombreCientifico;
    }
    if (nombreIngles) {
        whereClause.nombre_ingles = nombreIngles;
    }

    const includeArr = [
        { model: Grupos, as: 'grupo', attributes: ['id_grupo', 'nombre'] },
        { model: Familias, as: 'familia', attributes: ['id_familia', 'nombre'] },
        {
            model: Paises,
            as: 'paises', // El mismo alias que en la definición de la asociación
            attributes: ['id_pais', 'nombre'],
            through: {
                attributes: []
            }
        }

    ];

    if (pais) {
        includeArr.push({
            model: Paises,
            as: 'paises',
            attributes: ['id_pais', 'nombre'],
            through: {
                attributes: [],
            },
            where: { id_pais: pais }
        });
    }
    const avesFiltradasOptions = await Aves.findAll({
        where: whereClause,
        include: includeArr,
    });

    const newOptions = {
        grupos: [],
        familias: [],
        paises: [],
        nIngles: [],
        nCientifico: [],
    };

    if (!grupo) {
        const gruposSet = new Set();

        avesFiltradasOptions.forEach(ave => {
            gruposSet.add(JSON.stringify({
                id: ave.grupo.dataValues.id_grupo,
                nombre: ave.grupo.dataValues.nombre
            }));
        });

        const gruposArray = Array.from(gruposSet).map(grupo => JSON.parse(grupo));
        newOptions.grupos = gruposArray
    }

    if (!familia) {
        const familiasSet = new Set();

        avesFiltradasOptions.forEach(ave => {
            familiasSet.add(JSON.stringify({
                id: ave.familia.dataValues.id_familia,
                nombre: ave.familia.dataValues.nombre
            }));
        });

        const familiasArray = Array.from(familiasSet).map(item => JSON.parse(item));
        newOptions.familias = familiasArray;
    }
    if (!pais) {
        const paisesSet = new Set();

        avesFiltradasOptions.forEach(ave => {
            ave.paises.forEach(pais => paisesSet.add(JSON.stringify({
                id: pais.dataValues.id_pais,
                nombre: pais.dataValues.nombre
            })));
        });

        newOptions.paises = Array.from(paisesSet).map(pais =>
            JSON.parse(pais));
    }

    if (!nombreCientifico) {
        const nombresCientificos = [...new Set(avesFiltradasOptions.map(ave => ({ nombre: ave.dataValues.nombre_cientifico })))];
        newOptions.nCientifico = nombresCientificos;
    }

    if (!nombreIngles) {
        const nombresIngles = [...new Set(avesFiltradasOptions.map(ave => ({ nombre: ave.dataValues.nombre_ingles })))];
        newOptions.nIngles = nombresIngles;
    }



    return newOptions;

};
module.exports = {
    fetchOptions,
    filterOptions,
    fetchFilterBirds
}
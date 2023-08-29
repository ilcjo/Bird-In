const { QueryTypes } = require("sequelize");
const { conn } = require("../../db/db");
const { Aves, Grupos, Familias, Paises } = require('../../db/db');
const { mapFieldValues } = require("../../utils/mapOptions");

const DEFAULT_PER_PAGE = 9;
const DEFAULT_PAGE = 1;

const fetchBirds = async () => {
    const fetchInfo = await conn.query(
        'SELECT * FROM view_all_birds', // Aquí tu consulta a la vista
        { type: QueryTypes.SELECT }
    );

    return fetchInfo
}


const fetchFilterBirds = async (familia, grupo, nombreCientifico, nombreIngles, pais, page, perPage) => {

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
}

const filterOptions = async (familia, grupo, nombreCientifico, nombreIngles, pais) => {

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
    const avesFiltradasOptions = await Aves.findAll({
        where: whereClause,
        include: includeArr,
    });

    const newOptions = {
        grupos: [],
        familias: [],
        nombresIn: [],
        nombresCientifico: [],
        paises: []
    };

    if (!grupo) {
        const nombresGrupos = [...new Set(avesFiltradasOptions.map(ave => ave.grupo.dataValues.nombre))];
        newOptions.grupos = nombresGrupos;
    }
    if (!familia) {
        const nombresFamilias = [...new Set(avesFiltradasOptions.map(ave => ave.familia.dataValues.nombre))];
        newOptions.familias = nombresFamilias;
    }

    if (!nombreCientifico) {
        const nombresCientificos = [...new Set(avesFiltradasOptions.map(ave => ave.dataValues.nombre_cientifico))];
        newOptions.nombresCientifico = nombresCientificos;
    }

    if (!nombreIngles) {
        const nombresIngles = [...new Set(avesFiltradasOptions.map(ave => ave.dataValues.nombre_ingles))];
        newOptions.nombresIn = nombresIngles;
    }

    if (!pais) {
        const paisesSet = new Set();
        avesFiltradasOptions.forEach(ave => {
            ave.paises.forEach(pais => paisesSet.add(pais.dataValues.nombre));
        });
        newOptions.paises = [...paisesSet];
    }


    return newOptions;

};
module.exports = {
    fetchBirds,
    fetchOptions,
    filterOptions,
    fetchFilterBirds
}
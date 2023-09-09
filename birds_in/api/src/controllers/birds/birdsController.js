const { Op } = require("sequelize");
const { Aves, Grupos, Familias, Paises } = require('../../db/db');
const mapFieldValues = require('../../utils/mapOptions');


const DEFAULT_PER_PAGE = 9;
const DEFAULT_PAGE = 1;

const fetchFilterBirds = async (familia, grupo, nombreCientifico, nombreIngles, pais, page, perPage) => {
    console.log('funcion all birds',familia, grupo, nombreCientifico, nombreIngles, pais, page, perPage)
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
            attributes: ['nombre', 'id_pais'],
            through: {
                attributes: []
            }
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
    console.log('soy pagina', perPageConvert)

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
    return {
        grupos: nombresGrupos,
        familias: nombreFamilias,
        paises: nombrePaises,
        nIngles: nombreIngles,
        nCientifico: nombreCientifico
    }
};

const filterOptions = async (grupo, familia, pais, nombreIngles, nombreCientifico,) => {
    const perpage = '0'
    const page = '0'
    const allResults = await fetchFilterBirds(grupo, familia, pais, nombreIngles, nombreCientifico, page, perpage)
    
    const newOptions = {
        grupos: [],
        familias: [],
        paises: [],
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
    
    return newOptions;

};
module.exports = {
    fetchOptions,
    filterOptions,
    fetchFilterBirds
}
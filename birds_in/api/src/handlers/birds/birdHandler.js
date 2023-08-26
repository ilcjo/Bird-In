const { Op } = require("sequelize");
const { fetchBirds } = require("../../controllers/birds/birdsController");
const { Aves, Familias, Grupos, Paises } = require('../../db/db')

const DEFAULT_PER_PAGE = 9;
const DEFAULT_PAGE = 1;

const getAllBirds = async (req, res) => {
   try {
      const birdsInfo = await fetchBirds()
      return res.status(200).json(birdsInfo)
   } catch (error) {
      res.status(400).json({ error: error.message })
   }
};

const getFilterInfo = async (req, res) => {

   const { familia, grupo, nombreCientifico, nombreIngles, pais, page, perPage } = req.query;

   try {

      const whereClause = {};
      if (familia) {
         whereClause.familias_id_familia = familia;
      }
      if (grupo) {
         whereClause.grupos_id_grupo = grupo;
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

      if (avesFiltradas.length === 0) {
         return res.status(404).json({ message: 'No se encontraron aves que cumplan con los criterios de búsqueda.' });
      }

      res.json(avesFiltradas);
   } catch (error) {
      console.error(error);
      res.status(500).send('Error en el servidor');
   }

}


module.exports = {
   getAllBirds,
   getFilterInfo
}
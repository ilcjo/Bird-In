const { fetchBirds, fetchFilteredInfo } = require("../../controllers/birds/birdsController");
const { Aves } = require('../../db/db')

const getAllBirds = async (req, res) => {
   try {
      const birdsInfo = await fetchBirds()
      return res.status(200).json(birdsInfo)
   } catch (error) {
      res.status(400).json({ error: error.message })
   }
};

const getFilterInfo = async (req, res) => {

   const { familiaId, grupo, nombreCientifico, nombreIngles, pais } = req.query;

   console.log(familiaId)
   try {

      const whereClause = {};
      console.log(whereClause)

      if (familiaId) {
         whereClause.familias_id_familia = familiaId;
      }
      if (grupo) {
         whereClause.nombre_grupo = grupo;
      }
      if (nombreCientifico) {
         whereClause.nombre_cientifico = nombreCientifico;
      }
      if (nombreIngles) {
         whereClause.nombre_ingles = nombreIngles;
      }
      if (pais) {
         // Aplicar filtro en relación a los países
      }

      const avesFiltradas = await Aves.findAll({
         where: whereClause,
      });

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
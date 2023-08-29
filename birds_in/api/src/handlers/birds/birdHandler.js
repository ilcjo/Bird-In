const { Op } = require("sequelize");
const { fetchBirds, fetchOptions, filterOptions, fetchFilterBirds } = require("../../controllers/birds/birdsController");
const { Aves, Familias, Grupos, Paises } = require('../../db/db')


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
      const allData = await fetchFilterBirds(familia, grupo, nombreCientifico, nombreIngles, pais, page, perPage)
      console.log(allData)
      if (allData.length === 0) {
         return res.status(404).json({ message: 'No se encontraron aves que cumplan con los criterios de búsqueda.' });
      }
      res.json(allData);

   } catch (error) {
      console.error(error);
      res.status(500).send('Error en el servidor');
   }

};

const selectOptions = async (req, res) => {
   try {
      const getAllOptions = await fetchOptions()
      return res.status(200).json(getAllOptions)
   } catch (error) {
      res.status(500).send({ error: error.message })
   }
}

const getFilterOptions = async (req, res,) => {
   const { familia, grupo, nombreCientifico, nombreIngles, pais } = req.query;
   try {
      const newOptions = await filterOptions(familia, grupo, nombreCientifico, nombreIngles, pais)
      return res.status(200).json(newOptions)
   } catch (error) {
      res.status(500).send({ error: error.message })

   }
}

module.exports = {
   getAllBirds,
   getFilterInfo,
   selectOptions,
   getFilterOptions
}
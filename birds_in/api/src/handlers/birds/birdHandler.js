
const { fetchOptions, filterOptions, fetchFilterBirds, sendAndCreateBird } = require("../../controllers/birds/birdsController");
const ftp = require('basic-ftp');
const checkFTPConnection = require("../../utils/checkFtp");


const getFilterInfo = async (req, res) => {

   const { familia, grupo, nombreCientifico, nombreIngles, pais, zonasNombre, page, perPage } = req.query;
   try {
      const allData = await fetchFilterBirds(familia, grupo, nombreCientifico, nombreIngles, pais, zonasNombre, page, perPage)
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
      res.status(500).json({ error: error.message })
   }
}

const getFilterOptions = async (req, res,) => {
   const { familia, grupo, nombreCientifico, nombreIngles, pais, zonas } = req.query;
   try {
      const newOptions = await filterOptions(familia, grupo, nombreCientifico, nombreIngles, pais, zonas)
      return res.status(200).json(newOptions)
   } catch (error) {
      res.status(500).send({ error: error.message })

   }
}

const createBird = async (req, res) => {

   const imagenes = req.file;

   try {

      const succesCreate = await sendAndCreateBird(

         imagenes,
      )
      return res.status(200).json(succesCreate)

   } catch (error) {
      res.status(500).send({ error: error.message })
   }
};

const uploadImageftp = async (req, res) => {
   try {
      // Verifica la conexión FTP antes de continuar

      const client = new ftp.Client();
      const remotePath = '/';
      client.ftp.timeout = 1000000;
      await client.access({
         host: 'ftp.hotelparque97.com',
         user: 'dev_bird@lasavesquepasaronpormisojos.com',
         password: 'Leon1316',
         secure: false,
      });

      const image = req.file;

      if (!image) {
         return res.status(400).json({ error: 'No se subió ninguna imagen' });
      }

      const remoteFileName = `${Date.now()}_${image.originalname}`;
      await client.uploadFrom(image.path, `${remotePath}/${remoteFileName}`);

      // Cerrar la conexión FTP
      await client.close();

      // Eliminar la imagen del servidor local después de una transferencia exitosa
      const fs = require('fs');
      fs.unlink(image.path, (err) => {
         if (err) {
            console.error('Error al eliminar la imagen del servidor local:', err);
         } else {
            console.log('Imagen eliminada del servidor local con éxito');
         }
      });

      res.status(200).json({ message: 'Imagen subida con éxito al servidor FTP' });
   } catch (error) {
      console.error('Error al cargar la imagen en FTP:', error);
      res.status(500).json({ error: 'Error al cargar la imagen en FTP' });
   }
};
 

module.exports = {
   getFilterInfo,
   selectOptions,
   getFilterOptions,
   createBird,
   uploadImageftp
}
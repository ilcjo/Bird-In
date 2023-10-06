require('dotenv').config();
const {
   fetchOptions,
   filterOptions,
   fetchFilterBirds,
   sendAndCreateBird,
   findDataById,
   sendAndUpdateBird,
   saveDbDescatada,
   findPhotosId,
   setDbCover,

} = require("../../controllers/birds/birdsController");
const ftp = require('basic-ftp');
const {
   FTP_HOST,
   FTP_USER,
   FTP_PASS,
} = process.env

const deletePhotoFromFTP = require('../../utils/deletFtp');

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
};

const getFilterOptions = async (req, res,) => {
   const { familia, grupo, nombreCientifico, nombreIngles, pais, zonas } = req.query;
   try {
      const newOptions = await filterOptions(familia, grupo, nombreCientifico, nombreIngles, pais, zonas)
      return res.status(200).json(newOptions)
   } catch (error) {
      res.status(500).send({ error: error.message })

   }
};

const createBird = async (req, res) => {

   const {
      grupo,
      familia,
      pais,
      zona,
      cientifico,
      ingles,
      comun,
      urlWiki,
      urlBird,
      urlImagen

   } = req.body;
   try {

      const succesCreate = await sendAndCreateBird(
         grupo,
         familia,
         pais,
         zona,
         cientifico,
         ingles,
         comun,
         urlWiki,
         urlBird,
         urlImagen)
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
         host: FTP_HOST,
         user: FTP_USER,
         password: FTP_PASS,
         secure: false,
      });

      const images = req.files; // Usar req.files para manejar múltiples archivos

      if (!images || images.length === 0) {
         return res.status(400).json({ error: 'No se subió ninguna imagen' });
      }

      const imageUrls = []; // Definir imageUrls fuera del bucle

      for (const image of images) {
         const remoteFileName = `${Date.now()}_${image.originalname}`;
         await client.uploadFrom(image.path, `${remotePath}/${remoteFileName}`);

         // Obtén la URL completa de la imagen
         const imageUrl = `https://lasavesquepasaronpormisojos.com/imagenes/${remoteFileName}`;
         // Agrega la URL al array de imageUrls
         imageUrls.push(imageUrl);

         // Eliminar la imagen del servidor local después de una transferencia exitosa
         const fs = require('fs');
         fs.unlink(image.path, (err) => {
            if (err) {
               console.error('Error al eliminar la imagen del servidor local:', err);
            } else {
               console.log('Imagen eliminada del servidor local con éxito');
            }
         });
      }

      // Cerrar la conexión FTP después de subir todas las imágenes
      await client.close();

      res.status(200).json({ message: 'Imágenes subidas con éxito al servidor FTP', imageUrls });
   } catch (error) {
      console.error('Error al cargar las imágenes en FTP:', error);
      res.status(500).json({ error: 'Error al cargar las imágenes en FTP' });
   }
};

const findInfoForUpdate = async (req, res) => {
   const { id } = req.query;
   try {
      if (!id) {
         return res.status(400).json({ error: 'ID de ave no proporcionado' });
      }
      const formDataUpdate = await findDataById(id);
      if (!formDataUpdate) {
         return res.status(404).json({ error: 'Ave no encontrada' });
      }
      return res.status(200).json(formDataUpdate);
   } catch (error) {
      res.status(500).json({ error: 'Error actualizando ave' });
   }
};

const updateInfoBids = async (req, res) => {
   const {
      grupo,
      familia,
      pais,
      zona,
      cientifico,
      ingles,
      comun,
      urlWiki,
      urlBird,
      urlImagen,
      idAve,
   } = req.body;

   try {
      const succesUpdate = await sendAndUpdateBird(
         grupo,
         familia,
         pais,
         zona,
         cientifico,
         ingles,
         comun,
         urlWiki,
         urlBird,
         urlImagen,
         idAve,
      )
      return res.status(200).json(succesUpdate)

   } catch (error) {
      res.status(500).send({ error: error.message })
   }
};

const deletePhotos = async (req, res) => {
   const { ids, urls } = req.body;
   try {
      const deletedFtp = await deletePhotoFromFTP(urls);

      if (!deletedFtp.success) {
         // Algunas fotos no se encontraron o hubo errores en el servidor FTP
         console.warn('Error al eliminar fotos del servidor FTP. No se eliminaron de la base de datos.');
         return res.status(400).json({ error: 'Error al eliminar fotos del servidor FTP. No se eliminaron de la base de datos.' });
      }

      // Continúa con la lógica para eliminar de la base de datos
      const deletedDb = await findPhotosId(ids);
      return res.status(200).json(deletedDb);
   } catch (error) {
      console.error('Error en el controlador deletePhotos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
   }
};

const setCoverPhoto = async (req, res) => {
   const { idFoto, idAve } = req.body
   console.log(idFoto)
   console.log(idAve)
   try {
      const newCover = await setDbCover(idFoto, idAve)
      return res.status(200).json(newCover);

   } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
   }
};

module.exports = {
   getFilterInfo,
   selectOptions,
   getFilterOptions,
   createBird,
   uploadImageftp,
   findInfoForUpdate,
   updateInfoBids,
   deletePhotos,
   setCoverPhoto
}


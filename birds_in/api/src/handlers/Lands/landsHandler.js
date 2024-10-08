
require('dotenv').config();
const exceljs = require('exceljs');
const {
   findNameDuplicateP,
   sendAndCreateLand,
   findDataByNameP,
   findDataByIdP,
   fetchFilterLands,
   setDbCoverPaisaje,
   findPhotosIdPaisaje,
   sendAndUpdatePaisaje,
   deleteRegisterDb,
   fetchOptionsLand,
   filterOptionsPaisZonasPaisaje,
   findNameDuplicatePP
} = require('../../controllers/Lands/landsController');

const ftp = require('basic-ftp');
const { VistaPaisajesOrdenadaAll } = require('../../config/db/db');
const { deletePhotoFromFTPPaisajes } = require('../../services/deletFtp');
const {
   FTP_HOST_2,
   FTP_USER_2,
   FTP_PASS_2,
} = process.env

const getFilterInfoP = async (req, res) => {
   const { pais, zonas, page, perPage } = req.query;
   try {
      const allData = await fetchFilterLands(pais, zonas, page, perPage)
      // console.log(allData, 'DATA')
      if (allData.length === 0) {
         return res.status(404).json({ message: 'No se encontraron aves que cumplan con los criterios de búsqueda.' });
      }
      res.json(allData);
   } catch (error) {
      console.error(error);
      res.status(500).send('Error en el servidor');
   }

};

const selectOptionsP = async (req, res) => {
   try {
      const getAllOptions = await fetchOptionsLand()
      return res.status(200).json(getAllOptions)
   } catch (error) {
      res.status(500).json({ error: error.message })
   }
};

const getFilterOptionsP = async (req, res,) => {
   const {
      pais,
      zona,
   } = req.query;
   try {
      let newOptions;
      if (zona || pais) {
         newOptions = await filterOptionsPaisZonasPaisaje(
            pais,
            zona,
         );
      }
      return res.status(200).json(newOptions);
   } catch (error) {
      res.status(500).send({ error: error.message })
   }
};

const createLand = async (req, res) => {
   const {
      pais,
      zona,
      descripcion,
      urlWiki,
      urlImagen,
      map
   } = req.body;

   try {

      const succesCreate = await sendAndCreateLand(
         pais,
         zona,
         descripcion,
         urlWiki,
         urlImagen,
         map)
      return res.status(200).json(succesCreate)

   } catch (error) {
      res.status(500).json({ error: error.message })
   }
};

const uploadImageftpPaisajes = async (req, res) => {
   try {
      // Verifica la conexión FTP antes de continuar
      const client = new ftp.Client();
      const remotePath = '/paisajes';
      client.ftp.timeout = 1000000;
      await client.access({
         host: FTP_HOST_2,
         user: FTP_USER_2,
         password: FTP_PASS_2,
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
         const imageUrl = `https://lasavesquepasaronpormisojos.com/generalimag/paisajes/${remoteFileName}`;
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

const findInfoForUpdateP = async (req, res) => {
   const { id } = req.query;
   try {
      if (!id) {
         return res.status(400).json({ error: 'ID de Registro no proporcionado' });
      }
      const formDataUpdate = await findDataByIdP(id);
      if (!formDataUpdate) {
         return res.status(404).json({ error: 'Registro no encontrada' });
      }
      return res.status(200).json(formDataUpdate);
   } catch (error) {
      res.status(500).json({ error: 'Error al Recuperar Registro' });
   }
};

const findInfoForUpdateNameP = async (req, res) => {
   const { name } = req.query;
   try {
      if (!name) {
         return res.status(400).json({ error: 'Nombre no proporcionado' });
      }
      const formDataUpdate = await findDataByNameP(name);
      if (!formDataUpdate) {
         return res.status(404).json({ error: 'Registro no encontrado' });
      }
      return res.status(200).json(formDataUpdate);
   } catch (error) {
      res.status(500).json({ error: 'Error al actualizar' });
   }
};


const updateInfoPaisaje = async (req, res) => {
   const {
      pais,
      zona,
      descripcion,
      urlWiki,
      urlImagen,
      idPaisaje,
      map
   } = req.body;
   try {
      const successUpdate = await sendAndUpdatePaisaje(
         pais,
         zona,
         descripcion,
         urlWiki,
         urlImagen,
         idPaisaje,
         map
      )
      return res.status(200).json(successUpdate)

   } catch (error) {
      res.status(500).send({ error: error.message })
   }
};

const deletePhotosPaisajes = async (req, res) => {
   const { ids, urls } = req.body;
   try {
      const deletedFtp = await deletePhotoFromFTPPaisajes(urls);
      if (!deletedFtp.success) {
         // Algunas fotos no se encontraron o hubo errores en el servidor FTP
         console.warn('Error al eliminar fotos del servidor FTP. No se eliminaron de la base de datos.');
         return res.status(400).json({ error: 'Error al eliminar fotos del servidor FTP. No se eliminaron de la base de datos.' });
      }

      // Continúa con la lógica para eliminar de la base de datos
      const deletedDb = await findPhotosIdPaisaje(ids);
      return res.status(200).json(deletedDb);
   } catch (error) {
      console.error('Error en el controlador deletePhotos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
   }
};

const setCoverPhotoP = async (req, res) => {
   const { idFoto, idPaisaje } = req.body
   try {
      const newCover = await setDbCoverPaisaje(idFoto, idPaisaje)
      return res.status(200).json(newCover);

   } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
   }
};

const contandoRegistros = async (req, res) => {
   try {
      const allData = await getContadores()
      return res.status(200).json(allData);
   } catch (error) {
      console.error(error);
      res.status(500).send('Error en el servidor');
   }
};

const deletePaisaje = async (req, res) => {
   const { id } = req.query
   try {
      const message = await deleteRegisterDb(id)
      return res.status(200).json(message);
   } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
   }
};

const checkLandsDuplicate = async (req, res) => {
   const { zona } = req.query
   try {
      const message = await findNameDuplicateP(zona)
      return res.status(200).json(message);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
};

const checkLandsDuplicateP = async (req, res) => {
   const { zona } = req.query
   try {
      const message = await findNameDuplicatePP(zona)
      return res.status(200).json(message);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
};

const getExcel = async (req, res) => {
   try {
      // Consulta las aves desde tu base de datos o donde sea que las tengas almacenadas
      const registro = await VistaPaisajesOrdenadaAll.findAll();
      // Crea un nuevo workbook y worksheet con excel.js
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('Aves');

      // Define las columnas en tu archivo Excel
      worksheet.columns = [
         { header: 'País', key: 'pais', width: 20 },
         { header: 'Zona', key: 'zona', width: 20 },
         { header: 'Descripción', key: 'descripcion', width: 20 },
         { header: 'Map', key: 'url', width: 20 },
         { header: 'Portada', key: 'tiene_portada', width: 20 },
         { header: 'Imágenes', key: 'imagenes', width: 20 },
         // Añade más columnas según los datos que quieras incluir en tu archivo Excel
      ];

      // Agrega las filas al worksheet con los datos de las aves
      registro.forEach((registro) => {
         worksheet.addRow({
            pais: registro.pais,
            zona: registro.zona,
            descripcion: registro.descripcion,
            map: registro.map,
            tiene_portada: registro.tiene_portada,
            imagenes: registro.imagenes,
         });
      });

      // Configura la respuesta HTTP para descargar el archivo Excel
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=paisajes.xlsx');

      // Escribe el workbook en el flujo de respuesta (response stream)
      await workbook.xlsx.write(res);
      res.end();

   } catch (error) {
      console.error('Error al descargar el archivo Excel:', error);
      res.status(500).json({ message: 'Error al descargar el archivo Excel' });
   }
};

module.exports = {
   getExcel,
   getFilterInfoP,
   selectOptionsP,
   getFilterOptionsP,
   createLand,
   uploadImageftpPaisajes,
   findInfoForUpdateP,
   updateInfoPaisaje,
   deletePhotosPaisajes,
   setCoverPhotoP,
   contandoRegistros,
   deletePaisaje,
   findInfoForUpdateNameP,
   checkLandsDuplicate,
   checkLandsDuplicateP,
}


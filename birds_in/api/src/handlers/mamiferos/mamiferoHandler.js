require('dotenv').config();
const exceljs = require('exceljs');
const ftp = require('basic-ftp');
const {
   FTP_HOST_2,
   FTP_USER_2,
   FTP_PASS_2,
} = process.env

const { VistaMamiferosOrdenadaAll } = require('../../config/db/db');
const { fetchFilterRegister, fetchOptions, filterOptionsPaisZonas, filterOptions, sendAndCreateInsect, findDataById, findDataByName, sendAndUpdateInsect, findPhotosId, setDbCover, getContadores, deleteRegistroDb, findNameDuplicate, sendAndCreateRegister, sendAndUpdateRegister, findAllEnglishNames, getClassGrupoFamilia, findGroupNameDuplicate, findFamilyNameDuplicate } = require('../../controllers/mamiferos/mamiferoController');
const { deletePhotoFromFTPMamiferos } = require('../../services/deletFtp');

const getAllNombres = async (req, res) => {
   try {
      const allData = await findAllEnglishNames()
      res.status(200).json(allData);
   } catch (error) {
      console.error(error);
      res.status(500).send('Error en el servidor');
   }
};

const getFilterInfo = async (req, res) => {

   const { familia, grupo, nombreCientifico, nombreIngles, pais, zonas, page, perPage } = req.query;
   try {
      const allData = await fetchFilterRegister(familia, grupo, nombreCientifico, nombreIngles, pais, zonas, page, perPage)
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
   const { familia,
      grupo,
      nombreCientifico,
      nombreIngles,
      pais,
      zonas,
   } = req.query;
   // console.log(zonas,'llegue')
   try {
      let newOptions;
      if (zonas || pais) {
         newOptions = await filterOptionsPaisZonas(familia,
            grupo,
            nombreCientifico,
            nombreIngles,
            pais,
            zonas,
         );
      } else {
         newOptions = await filterOptions(familia,
            grupo,
            nombreCientifico,
            nombreIngles,
            pais,
            zonas,
         );
      }
      return res.status(200).json(newOptions);
   } catch (error) {
      res.status(500).send({ error: error.message })
   }
};

const createMamifero = async (req, res) => {
   const {
      grupo,
      familia,
      pais,
      zona,
      cientifico,
      ingles,
      comun,
      urlWiki,
      urlImagen

   } = req.body;

   try {

      const successCreate = await sendAndCreateRegister(
         grupo,
         familia,
         pais,
         zona,
         cientifico,
         ingles,
         comun,
         urlWiki,
         urlImagen)
      return res.status(200).json(successCreate)

   } catch (error) {
      res.status(500).json({ error: error.message })
   }
};

const uploadImageftp = async (req, res) => {
   try {
      // Verifica la conexión FTP antes de continuar
      const client = new ftp.Client();
      const remotePath = '/mamiferos';
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
         const imageUrl = `https://lasavesquepasaronpormisojos.com/generalimag/mamiferos/${remoteFileName}`;
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
         return res.status(400).json({ error: 'ID de Registro no proporcionado' });
      }
      const formDataUpdate = await findDataById(id);
      if (!formDataUpdate) {
         return res.status(404).json({ error: 'Registro no encontrada' });
      }
      return res.status(200).json(formDataUpdate);
   } catch (error) {
      res.status(500).json({ error: 'Error actualizando el Registro' });
   }
};

const findInfoForUpdateName = async (req, res) => {
   const { name } = req.query;
   try {
      if (!name) {
         return res.status(400).json({ error: 'ID de ave no proporcionado' });
      }
      const formDataUpdate = await findDataByName(name);
      if (!formDataUpdate) {
         return res.status(404).json({ error: 'Registro no encontrada' });
      }
      return res.status(200).json(formDataUpdate);
   } catch (error) {
      res.status(500).json({ error: 'Error actualizando Registro' });
   }
};


const updateInfoRegister = async (req, res) => {
   const {
      grupo,
      familia,
      pais,
      zona,
      cientifico,
      ingles,
      comun,
      urlWiki,
      urlImagen,
      id,
   } = req.body;

   try {
      const succesUpdate = await sendAndUpdateRegister(
         grupo,
         familia,
         pais,
         zona,
         cientifico,
         ingles,
         comun,
         urlWiki,
         urlImagen,
         id,
      )
      return res.status(200).json(succesUpdate)

   } catch (error) {
      res.status(500).send({ error: error.message })
   }
};

const deletePhotos = async (req, res) => {
   const { ids, urls } = req.body;
   try {
      const deletedFtp = await deletePhotoFromFTPMamiferos(urls);
      // console.log(deletedFtp)
      if (!deletedFtp.success) {
         // Algunas fotos no se encontraron o hubo errores en el servidor FTP
         console.warn('Error al eliminar fotos del servidor FTP. No se eliminaron de la base de datos.');
         return res.status(404).json({ error: 'Error al eliminar fotos del servidor FTP. No se eliminaron de la base de datos.' });
      }

      // Continúa con la lógica para eliminar de la base de datos
      const deletedDb = await findPhotosId(ids);
      return res.status(200).json(deletedDb);
   } catch (error) {
      console.error('Error en el controlador deletePhotos:', error);
      res.status(500).json({ error: 'Error al eliminar fotos del servidor FTP. No se eliminaron de la base de datos.' });
   }
};

const setCoverPhoto = async (req, res) => {
   const { idFoto, idRegistro } = req.body
   try {
      const newCover = await setDbCover(idFoto, idRegistro)
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

const deleteRegistro = async (req, res) => {
   const { id } = req.query
   try {
      const message = await deleteRegistroDb(id)
      return res.status(200).json(message);
   } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
   }
};

const checkRegisterDuplicate = async (req, res) => {
   const { name } = req.query
   try {
      const message = await findNameDuplicate(name)
      return res.status(200).json(message);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
};

const getExcel = async (req, res) => {
   try {
      // Consulta las aves desde tu base de datos o donde sea que las tengas almacenadas
      const aves = await VistaMamiferosOrdenadaAll.findAll();

      // Crea un nuevo workbook y worksheet con excel.js
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('Aves');

      // Define las columnas en tu archivo Excel
      worksheet.columns = [
         { header: 'Nombre Inglés', key: 'nombre_ingles', width: 20 },
         { header: 'Nombre Científico', key: 'nombre_cientifico', width: 20 },
         { header: 'Nombre Común', key: 'nombre_comun', width: 20 },
         { header: 'Nombre Genero', key: 'nombre_genero', width: 20 },
         { header: 'Nombre Familia', key: 'nombre_familia', width: 20 },
         { header: 'Paises', key: 'paises', width: 20 },
         { header: 'Zonas', key: 'zonas', width: 20 },
         { header: 'URL Wiki', key: 'url_wiki', width: 20 },
         { header: 'Portada', key: 'tiene_portada', width: 20 },
         { header: 'Imágenes', key: 'imagenes', width: 20 },
         // Añade más columnas según los datos que quieras incluir en tu archivo Excel
      ];

      // Agrega las filas al worksheet con los datos de las aves
      aves.forEach((registro) => {
         worksheet.addRow({
            nombre_ingles: registro.nombre_ingles,
            nombre_cientifico: registro.nombre_cientifico,
            nombre_comun: registro.nombre_comun,
            nombre_genero: registro.nombre_genero,
            nombre_familia: registro.nombre_familia,
            paises: registro.paises,
            zonas: registro.zonas,
            url_wiki: registro.url_wiki,
            tiene_portada: registro.tiene_portada,
            imagenes: registro.imagenes,
         });
      });

      // Configura la respuesta HTTP para descargar el archivo Excel
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=mamiferos.xlsx');

      // Escribe el workbook en el flujo de respuesta (response stream)
      await workbook.xlsx.write(res);
      res.end();

   } catch (error) {
      console.error('Error al descargar el archivo Excel:', error);
      res.status(500).json({ message: 'Error al descargar el archivo Excel' });
   }
};

const checkClases = async (req, res) => {
   const { familiaID, grupoID } = req.query
   try {
      const message = await getClassGrupoFamilia(familiaID, grupoID)
      return res.status(200).json(message);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
};

const checkDuplicateNames = async (req, res) => {
   const { grupoName, familiaName } = req.query;
   try {
      if (grupoName) {
         const message = await findGroupNameDuplicate(grupoName);
         return res.status(200).json({ message });
      } else if (familiaName) {
         const message = await findFamilyNameDuplicate(familiaName);
         return res.status(200).json({ message });
      } else {
         // Si no se proporcionan ni grupoName ni familiaName, se devuelve un error
         return res.status(400).json({ error: "Debe proporcionar un nombre de grupo o de familia." });
      }
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
};


module.exports = {
   checkDuplicateNames,
   checkClases,
   createMamifero,
   getFilterInfo,
   selectOptions,
   getFilterOptions,
   uploadImageftp,
   findInfoForUpdate,
   findInfoForUpdateName,
   updateInfoRegister,
   deletePhotos,
   setCoverPhoto,
   contandoRegistros,
   deleteRegistro,
   checkRegisterDuplicate,
   getAllNombres,
   getExcel

}


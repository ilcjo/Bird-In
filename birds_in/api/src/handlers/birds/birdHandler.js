require('dotenv').config();
const {
   fetchOptions,
   filterOptions,
   fetchFilterBirds,
   sendAndCreateBird,
   findDataById,
   sendAndUpdateBird,
   findPhotosId,
   setDbCover,
   filterOptionsPaisZonas,
   getContadores,
   deleteBirdDb,
   findDataByName,
   findNameDuplicate,
   findAllEnglishNames,
   verificarRelaciones,
   getClassGrupoFamilia,
   findGroupNameDuplicate,
   findFamilyNameDuplicate,
   saveDbPhotoOrder,
} = require("../../controllers/birds/birdsController");
const exceljs = require('exceljs');
const ftp = require('basic-ftp');
const axios = require('axios');
const sharp = require('sharp');
const pLimit = require('p-limit').default;
const path = require('path');

const {
   FTP_HOST,
   FTP_USER,
   FTP_PASS,
} = process.env

const { deletePhotoFromFTP } = require('../../services/deletFtp');
const { VistaAvesOrdenadaAll } = require('../../config/db/db');
// const { connectToFtp, uploadImages } = require('../../utils/FTPUpoad');

const getFilterInfo = async (req, res) => {

   const { familia, grupo, nombreCientifico, nombreIngles, pais, zonas, page, perPage } = req.query;
   try {
      const allData = await fetchFilterBirds(familia, grupo, nombreCientifico, nombreIngles, pais, zonas, page, perPage)
      if (allData.length === 0) {
         return res.status(404).json({ message: 'No se encontraron aves que cumplan con los criterios de búsqueda.' });
      }
      res.json(allData);

   } catch (error) {
      console.error(error);
      throw error;
      // res.status(500).send('Error en el servidor');
   }
};

const getAllNombres = async (req, res) => {
   try {
      const allData = await findAllEnglishNames()
      res.status(200).json(allData);
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
      res.status(500).json({ error: error.message })
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

// const uploadImageftp = async (req, res) => {
//    const client = new ftp.Client();
//    client.ftp.timeout = 1000000;

//    try {
//       await connectToFtp(client);
//       const imageUrls = await uploadImages(client, req.files);
//       await client.close();

//       res.status(200).json({ message: 'Imágenes subidas con éxito al servidor FTP', imageUrls });
//    } catch (error) {
//       console.error('Error durante el proceso de subida de imágenes:', error);
//       res.status(500).json({ error: 'Error durante el proceso de subida de imágenes', uploaded: error.uploaded });
//    } finally {
//       client.close();
//    }
// };

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
      res.status(500).json({ error: 'Error ' });
   }
};

const findInfoForUpdateName = async (req, res) => {
   const { name } = req.query;
   try {
      if (!name) {
         return res.status(400).json({ error: 'Nombre de ave no proporcionado' });
      }
      const formDataUpdate = await findDataByName(name);
      if (!formDataUpdate) {
         return res.status(404).json({ error: 'Ave no encontrada' });
      }
      return res.status(200).json(formDataUpdate);
   } catch (error) {
      res.status(500).json({ error: 'Error' });
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
   const { idFoto, idAve } = req.body
   try {
      const newCover = await setDbCover(idFoto, idAve)
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

const deleteBird = async (req, res) => {
   const { id } = req.query
   try {
      const message = await deleteBirdDb(id)
      return res.status(200).json(message);
   } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
   }
};

const checkBirdDuplicate = async (req, res) => {
   const { name } = req.query
   try {
      const message = await findNameDuplicate(name)
      return res.status(200).json(message);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
};

            // const getExcelConPortada = async (req, res) => {
            //    try {
            //       let aves = await VistaAvesOrdenadaAll.findAll();

            //       aves.sort((a, b) => {
            //          if (a.nombre_ingles < b.nombre_ingles) return -1;
            //          if (a.nombre_ingles > b.nombre_ingles) return 1;
            //          return 0;
            //       });

            //       const workbook = new exceljs.Workbook();
            //       const worksheet = workbook.addWorksheet('Aves');
            //       const ALTO_FILA = 90;

            //       // 1. Agregamos 'Total' a las columnas
            //       worksheet.columns = [
            //          { header: 'Nombre Inglés', key: 'nombre_ingles', width: 25 },
            //          { header: 'Nombre Común', key: 'nombre_comun', width: 25 },
            //          { header: 'Nombre Científico', key: 'nombre_cientifico', width: 30 },
            //          { header: 'Nombre Grupo', key: 'nombre_grupo', width: 25 },
            //          { header: 'Total', key: 'total_imagenes', width: 10 }, // Nueva columna
            //          { header: 'Portada', key: 'portada', width: 35 }
            //       ];

            //       // Estilo para el encabezado
            //       worksheet.getRow(1).font = { bold: true };
            //       worksheet.getRow(1).alignment = { horizontal: 'center' };

            //       for (let i = 0; i < aves.length; i++) {
            //          const registro = aves[i];
            //          const currentRow = i + 2;

            //          // 2. Mapeamos el dato de tu vista a la columna 'total_imagenes'
            //          const row = worksheet.addRow({
            //             nombre_ingles: registro.nombre_ingles,
            //             nombre_comun: registro.nombre_comun,
            //             nombre_cientifico: registro.nombre_cientifico,
            //             nombre_grupo: registro.nombre_grupo,
            //             total_imagenes: registro.total_imagenes // Usa el nombre exacto de tu columna en la DB
            //          });

            //          row.height = ALTO_FILA;
            //          row.alignment = { vertical: 'middle', horizontal: 'left' };

            //          if (registro.portada_url) {
            //             try {
            //                const response = await axios.get(registro.portada_url, { responseType: 'arraybuffer' });
            //                const imagePipe = sharp(response.data);
            //                const metadata = await imagePipe.metadata();

            //                const compressedImage = await imagePipe
            //                   .resize({ height: 110 })
            //                   .jpeg({ quality: 30 })
            //                   .toBuffer();

            //                const imageId = workbook.addImage({
            //                   buffer: compressedImage,
            //                   extension: 'jpeg'
            //                });

            //                const aspecto = metadata.width / metadata.height;
            //                const anchoParaExcel = 110 * aspecto;

            //                // La columna de portada ahora es la 6 (índice 5) porque agregamos 'Total'
            //                worksheet.addImage(imageId, {
            //                   tl: { col: 5.1, row: i + 1.1 },
            //                   ext: { width: anchoParaExcel, height: 110 },
            //                   editAs: 'oneCell'
            //                });

            //             } catch (imgError) {
            //                console.log(`Error en imagen: ${imgError.message}`);
            //             }
            //          }
            //       }

            //       res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            //       res.setHeader('Content-Disposition', 'attachment; filename=avesFotos.xlsx');

            //       await workbook.xlsx.write(res);
            //       res.end();

            //    } catch (error) {
            //       console.error('Error al generar Excel:', error);
            //       res.status(500).send('Error al generar el Excel');
            //    }
            // };

const generarExcel = async (req, res) => {
   try {
      console.log('GENERANDO EXCEL CON IMÁGENES...');

      const aves = await VistaAvesOrdenadaAll.findAll();

      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('Aves');

      const ALTO_FILA = 90;

      worksheet.columns = [
         { header: 'Nombre Inglés', key: 'nombre_ingles', width: 25 },
         { header: 'Nombre Común', key: 'nombre_comun', width: 25 },
         { header: 'Nombre Científico', key: 'nombre_cientifico', width: 30 },
         { header: 'Nombre Grupo', key: 'nombre_grupo', width: 25 },
         { header: 'Total', key: 'total_imagenes', width: 10 },
         { header: 'Portada', key: 'portada', width: 35 }
      ];

      worksheet.getRow(1).font = { bold: true };

      // 1️⃣ crear filas primero
      aves.forEach((a) => {
         const row = worksheet.addRow({
            nombre_ingles: a.nombre_ingles,
            nombre_comun: a.nombre_comun,
            nombre_cientifico: a.nombre_cientifico,
            nombre_grupo: a.nombre_grupo,
            total_imagenes: a.total_imagenes
         });

         row.height = ALTO_FILA;
      });

      // 🔥 CACHE EN MEMORIA
      const imageCache = new Map();

      const limit = pLimit(6); // 🔥 clave para estabilidad

      const tareas = aves.map((registro, i) =>
         limit(async () => {
            try {
               if (!registro.portada_url) return;

               // 🔥 cache
               if (imageCache.has(registro.portada_url)) {
                  return imageCache.get(registro.portada_url);
               }

               const response = await axios.get(registro.portada_url, {
                  responseType: 'arraybuffer',
                  timeout: 15000
               });

               const buffer = await sharp(response.data)
                  .resize({ height: 110 })
                  .jpeg({ quality: 30 })
                  .toBuffer();

               const imageId = workbook.addImage({
                  buffer,
                  extension: 'jpeg'
               });

               const aspect = 110 / 110;

               const result = {
                  imageId,
                  index: i,
                  aspect
               };

               imageCache.set(registro.portada_url, result);

               return result;

            } catch (err) {
               console.log('Error imagen:', err.message);
               return null;
            }
         })
      );

      const resultados = await Promise.all(tareas);

      // 2️⃣ insertar imágenes
      resultados.forEach((img) => {
         if (!img) return;

         worksheet.addImage(img.imageId, {
            tl: { col: 5.1, row: img.index + 1.1 },
            ext: { width: 120, height: 110 },
            editAs: 'oneCell'
         });
      });

      res.setHeader(
         'Content-Type',
         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );

      res.setHeader(
         'Content-Disposition',
         'attachment; filename=aves.xlsx'
      );

      await workbook.xlsx.write(res);
      res.end();

   } catch (error) {
      console.error('ERROR:', error);
      res.status(500).send('Error generando Excel');
   }
};

const getAllAvesAsExcel = async (req, res) => {
   try {
      // console.log('llegu')
      // Consulta las aves desde tu base de datos o donde sea que las tengas almacenadas
      const aves = await VistaAvesOrdenadaAll.findAll();

      // Crea un nuevo workbook y worksheet con exceljs
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('Aves');

      // Define las columnas en tu archivo Excel
      worksheet.columns = [
         { header: 'Nombre Inglés', key: 'nombre_ingles', width: 20 },
         { header: 'Nombre Científico', key: 'nombre_cientifico', width: 20 },
         { header: 'Nombre Común', key: 'nombre_comun', width: 20 },
         { header: 'Nombre Grupo', key: 'nombre_grupo', width: 20 },
         { header: 'Nombre Familia', key: 'nombre_familia', width: 20 },
         { header: 'Paises', key: 'paises', width: 20 },
         { header: 'Zonas', key: 'zonas', width: 20 },
         { header: 'URL eBird', key: 'url_Ebird', width: 20 },
         { header: 'URL Wiki', key: 'url_wiki', width: 20 },
         { header: 'Portada', key: 'tiene_portada', width: 20 },
         { header: 'Imágenes', key: 'imagenes', width: 20 },
         // Añade más columnas según los datos que quieras incluir en tu archivo Excel
      ];

      // Agrega las filas al worksheet con los datos de las aves
      aves.forEach((ave) => {
         worksheet.addRow({
            nombre_ingles: ave.nombre_ingles,
            nombre_cientifico: ave.nombre_cientifico,
            nombre_comun: ave.nombre_comun,
            nombre_grupo: ave.nombre_grupo,
            nombre_familia: ave.nombre_familia,
            paises: ave.paises,
            zonas: ave.zonas,
            url_Ebird: ave.url_Ebird,
            url_wiki: ave.url_wiki,
            tiene_portada: ave.tiene_portada,
            imagenes: ave.imagenes,
         });
      });

      // Configura la respuesta HTTP para descargar el archivo Excel
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=aves.xlsx');

      // Escribe el workbook en el flujo de respuesta (response stream)
      await workbook.xlsx.write(res);
      res.end();

   } catch (error) {
      console.error('Error al descargar el archivo Excel:', error);
      res.status(500).json({ message: 'Error al descargar el archivo Excel' });
   }
};



const check = async (req, res) => {
   const { familia, grupo } = req.query
   try {
      const message = await verificarRelaciones(familia, grupo)
      return res.status(200).json(message);
   } catch (error) {
      res.status(500).json({ error: error.message });
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

const saveOrderImages = async (req, res) => {
   const { arrayImages } = req.body
   // console.log('handler:',arrayImages)
   try {
      const newCover = await saveDbPhotoOrder(arrayImages)
      return res.status(200).json(newCover);

   } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
   }
};

module.exports = {
   saveOrderImages,
   checkDuplicateNames,
   check,
   getFilterInfo,
   selectOptions,
   getFilterOptions,
   createBird,
   uploadImageftp,
   findInfoForUpdate,
   updateInfoBids,
   deletePhotos,
   setCoverPhoto,
   contandoRegistros,
   deleteBird,
   findInfoForUpdateName,
   checkBirdDuplicate,
   getAllAvesAsExcel,
   getAllNombres,
   checkClases,
   generarExcel,
}


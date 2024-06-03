const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
const {
    FTP_HOST,
    FTP_USER,
    FTP_PASS,
 } = process.env

const connectToFtp = async (client) => {
    await client.access({
       host: FTP_HOST,
       user: FTP_USER,
       password: FTP_PASS,
       secure: false,
    });
 };
 
const uploadImages = async (client, images) => {
    if (!images || images.length === 0) {
       throw new Error('No se subió ninguna imagen');
    }
    const remotePath = '/';
    const imageUrls = [];
 
    for (const image of images) {
       const remoteFileName = `${Date.now()}_${image.originalname}`;
       try {
          await client.uploadFrom(image.path, path.join(remotePath, remoteFileName));
          const imageUrl = `https://lasavesquepasaronpormisojos.com/imagenes/${remoteFileName}`;
          imageUrls.push(imageUrl);
          await deleteLocalFile(image.path);
       } catch (error) {
          console.error(`Error al subir la imagen ${image.originalname}:`, error);
          error.uploaded = imageUrls; // Attach uploaded image URLs to the error object
          throw error; // Re-throw the error to stop the process
       }
    }
 
    return imageUrls;
 };
 
 const deleteLocalFile = (filePath) => {
    return new Promise((resolve, reject) => {
       fs.unlink(filePath, (err) => {
          if (err) {
             console.error('Error al eliminar la imagen del servidor local:', err);
             reject(err);
          } else {
             console.log('Imagen eliminada del servidor local con éxito');
             resolve();
          }
       });
    });
 };
 
 module.exports = {
    deleteLocalFile,
    uploadImages,   
    connectToFtp
 };
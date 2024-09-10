const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');
const { deleteAllFilesInFolder, deleteAllFilesInUploadFolder } = require('../utils/deletAllInUpload');
const {
    FTP_HOST,
    FTP_USER,
    FTP_PASS,
    FTP_HOST_2,
    FTP_USER_2,
    FTP_PASS_2,
} = process.env

const deletePhotoFromFTP = async (urls) => {
    const client = new ftp.Client();

    try {
        await client.access({
            host: FTP_HOST,
            user: FTP_USER,
            password: FTP_PASS,
            secure: false,
        });

        for (const url of urls) {
            // Extraer el nombre del archivo de la URL
            const fileName = url.split('/').pop();

            // Construir la nueva URL sin el dominio
            const ftpUrl = `${fileName}`;
            // console.log(`Intentando eliminar del FTP: ${ftpUrl}`);
            // Eliminar el archivo del servidor local
            //     const fs = require('fs');
            //     fs.unlink(url, (err) => {
            //         if (err) {
            //             console.error('Error al eliminar la imagen del servidor local:', err);
            //         } else {
            //             console.log('Imagen eliminada del servidor local con éxito');
            //         }
            //     });

            //     // Eliminar el archivo del servidor FTP
            //     await client.remove(ftpUrl);
            // }
            // Eliminar el archivo del servidor FTP
            try {
                await client.remove(ftpUrl);
                console.log(`Imagen eliminada del servidor FTP con éxito: ${ftpUrl}`);
            } catch (ftpError) {
                console.error(`Error al eliminar la imagen del servidor FTP: ${ftpUrl}`, ftpError);
                continue; // Pasar a la siguiente URL si hay un error
            }

            // Eliminar todos los archivos en la carpeta 'upload' local
            deleteAllFilesInUploadFolder();
        }

        return { success: true };
    } catch (error) {
        console.error('Error al conectar con el servidor FTP:', error);
        return { success: false };
    } finally {
        await client.close();
    }
};

const deletePhotoFromFTPPaisajes = async (urls) => {
    // console.log(urls)
    const client = new ftp.Client();

    try {
        await client.access({
            host: FTP_HOST_2,
            user: FTP_USER_2,
            password: FTP_PASS_2,
            secure: false,
        });
        await client.cd('paisajes');

        for (const url of urls) {
            // Extraer el nombre del archivo de la URL
            const fileName = url.split('/').pop();

            // Construir la nueva URL sin el dominio
            const ftpUrl = `${fileName}`;

            // Eliminar el archivo del servidor local
            const fs = require('fs');
            fs.unlink(url, (err) => {
                if (err) {
                    console.error('Error al eliminar la imagen del servidor local:', err);
                } else {
                    console.log('Imagen eliminada del servidor local con éxito');
                }
            });

            // Eliminar el archivo del servidor FTP
            await client.remove(ftpUrl);
        }

        return { success: true };
    } catch (error) {
        console.error('Error al conectar con el servidor FTP:', error);
        return { success: false };
    } finally {
        await client.close();
    }
};

const deletePhotoFromFTPInsectos = async (urls) => {
    // console.log(urls)
    const client = new ftp.Client();

    try {
        await client.access({
            host: FTP_HOST_2,
            user: FTP_USER_2,
            password: FTP_PASS_2,
            secure: false,
        });
        await client.cd('insectos');

        for (const url of urls) {
            // Extraer el nombre del archivo de la URL
            const fileName = url.split('/').pop();

            // Construir la nueva URL sin el dominio
            const ftpUrl = `${fileName}`;

            // Eliminar el archivo del servidor local
            const fs = require('fs');
            fs.unlink(url, (err) => {
                if (err) {
                    console.error('Error al eliminar la imagen del servidor local:', err);
                } else {
                    console.log('Imagen eliminada del servidor local con éxito');
                }
            });

            // Eliminar el archivo del servidor FTP
            await client.remove(ftpUrl);
        }

        return { success: true };
    } catch (error) {
        console.error('Error al conectar con el servidor FTP:', error);
        return { success: false };
    } finally {
        await client.close();
    }
};

const deletePhotoFromFTPMamiferos = async (urls) => {
    const client = new ftp.Client();

    try {
        // Conectar al servidor FTP
        await client.access({
            host: FTP_HOST_2,
            user: FTP_USER_2,
            password: FTP_PASS_2,
            secure: false,
        });
        await client.cd('mamiferos');

        const fs = require('fs');

        // Recorrer todas las URLs para eliminar
        for (const url of urls) {
            // console.log(url)
            const fileName = url.split('/').pop();
            // console.log(fileName, ':foto:');
            const ftpUrl = `${fileName}`;
            // Verificar si el archivo existe antes de eliminar
            if (fs.existsSync(url)) {
                try {
                    await fs.promises.unlink(url);
                    console.log('Imagen eliminada del servidor local con éxito');
                } catch (err) {
                    console.error('Error al eliminar la imagen del servidor local:', err);
                }
            } else {
                console.warn('El archivo no existe en la ruta especificada:', url);
            }

            // Intentar eliminar el archivo del servidor FTP
            try {
                await client.remove(ftpUrl);
                console.log('Imagen eliminada del servidor FTP con éxito');
            } catch (ftpError) {
                console.error('Error al eliminar la imagen del servidor FTP:', ftpError);
                return { success: false };  // Retornar false si hay un error en el FTP
            }
        }

        return { success: true }; // Retornar true si todas las eliminaciones fueron exitosas
    } catch (error) {
        console.error('Error al conectar con el servidor FTP o al eliminar una imagen:', error);
        return { success: false };
    } finally {
        await client.close();
    }
};


const deletePhotoFromFTPReptiles = async (urls) => {
    // console.log(urls, 'urldelteftpfuncion')
    const client = new ftp.Client();

    try {
        await client.access({
            host: FTP_HOST_2,
            user: FTP_USER_2,
            password: FTP_PASS_2,
            secure: false,
        });
        await client.cd('reptiles');

        for (const url of urls) {
            // Extraer el nombre del archivo de la URL
            const fileName = url.split('/').pop();

            // Construir la nueva URL sin el dominio
            const ftpUrl = `${fileName}`;

            // Eliminar el archivo del servidor local
            const fs = require('fs');
            fs.unlink(url, (err) => {
                if (err) {
                    console.error('Error al eliminar la imagen del servidor local:', err);
                } else {
                    console.log('Imagen eliminada del servidor local con éxito');
                }
            });

            // Eliminar el archivo del servidor FTP
            await client.remove(ftpUrl);
        }

        return { success: true };
    } catch (error) {
        console.error('Error al conectar con el servidor FTP:', error);
        return { success: false };
    } finally {
        await client.close();
    }
};

module.exports = {
    deletePhotoFromFTP,
    deletePhotoFromFTPPaisajes,
    deletePhotoFromFTPInsectos,
    deletePhotoFromFTPMamiferos,
    deletePhotoFromFTPReptiles,
};

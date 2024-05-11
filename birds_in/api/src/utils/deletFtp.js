const ftp = require('basic-ftp');
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

const deletePhotoFromFTPPaisajes = async (urls) => {
    console.log(urls)
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


module.exports = {
    deletePhotoFromFTP,
    deletePhotoFromFTPPaisajes
};

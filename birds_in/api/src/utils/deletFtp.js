const ftp = require('basic-ftp');
const {
    FTP_HOST,
    FTP_USER,
    FTP_PASS,
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


module.exports = deletePhotoFromFTP;

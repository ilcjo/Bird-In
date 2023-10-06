const ftp = require('basic-ftp');
const { FTP_HOST, FTP_USER, FTP_PASS } = process.env;

const replacePhotoInFTP = async (oldImageUrl, newImageBuffer) => {
    const client = new ftp.Client();

    try {
        await client.access({
            host: FTP_HOST,
            user: FTP_USER,
            password: FTP_PASS,
            secure: false,
        });

        // Extraer el nombre del archivo de la URL
        const oldFileName = oldImageUrl.split('/').pop();

        // Construir la nueva URL sin el dominio
        const ftpPath = `customize/${oldFileName}`;

        // Subir la nueva imagen al servidor FTP
        await client.upload(newImageBuffer, ftpPath);

        return { success: true };
    } catch (error) {
        console.error('Error al conectar con el servidor FTP:', error);
        return { success: false };
    } finally {
        await client.close();
    }
};

module.exports = replacePhotoInFTP;

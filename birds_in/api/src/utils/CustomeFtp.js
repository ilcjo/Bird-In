const ftp = require('basic-ftp');
const { FTP_HOST, FTP_USER, FTP_PASS } = process.env;

const replacePhotoInFTP = async (oldImageUrl, newImageBuffer) => {
    console.log('soy url en funcion:', oldImageUrl, 'soy imagen en funcion', newImageBuffer)
    const client = new ftp.Client();

    try {
        await client.access({
            host: FTP_HOST,
            user: FTP_USER,
            password: FTP_PASS,
            secure: false,
        });

        await client.cd('customize');

        // Extraer el nombre del archivo de la URL antigua
        const oldFileName = oldImageUrl.split('/').pop();

        // Construir la ruta completa de la imagen antigua
        const oldImagePath = oldFileName;

        // Intentar eliminar la imagen antigua
        console.log('Eliminando la imagen antigua...');
        try {
            await client.remove(oldImagePath);
            console.log('Imagen antigua eliminada con éxito.');
        } catch (removeError) {
            console.warn('La imagen antigua no existe o hubo un error al intentar eliminarla:', removeError.message);
            // Continuar con la operación incluso si la imagen antigua no existe
        }
        console.log('Subiendo la nueva imagen...');
        await client.uploadFrom(newImageBuffer.path, `${newImageBuffer.filename}`);

        // Obtener la URL de la nueva imagen
        const newImageUrl = `https://lasavesquepasaronpormisojos.com/imagenes/customize/${newImageBuffer.filename}`;

        console.log('Operación completada con éxito.');
        return { success: true, imageUrl: newImageUrl };
    } catch (error) {
        console.error('Error al conectar con el servidor FTP o al manipular las imágenes:', error);
        return { success: false, message: 'Error al actualizar la imagen.', error: error };
    } finally {
        await client.close();
    }
};



module.exports = replacePhotoInFTP;

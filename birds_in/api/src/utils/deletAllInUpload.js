const fs = require('fs');
const path = require('path');

const deleteAllFilesInUploadFolder = () => {
    const uploadsDir = path.join(__dirname, '../../uploads');

    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            console.error('Error al leer la carpeta de uploads:', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(uploadsDir, file);

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error al eliminar el archivo ${file}:`, err);
                } else {
                    console.log(`Archivo ${file} eliminado con éxito`);
                }
            });
        });
    });
};

module.exports = {
    deleteAllFilesInUploadFolder
}

const {
    fetchCustome,
    sendParametersForUpdate,
    sendParametersForUpdateText
} = require("../../../controllers/settings/custome/customeController");
const replacePhotoInFTP = require("../../../services/CustomeFtp");

const getCustomes = async (req, res) => {
    try {
        const allCustomizes = await fetchCustome()
        // console.log(allCustomizes)
        return res.status(200).json(allCustomizes);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const updateCustomize = async (req, res) => {
    const file = req.file;
    const oldUrl = req.body.oldUrl;
    const campo = req.body.campo;
    // console.log(campo)
    try {
        const deletedFtp = await replacePhotoInFTP(oldUrl, file);
        if (!deletedFtp.success) {
            // Algunas fotos no se encontraron o hubo errores en el servidor FTP
            console.warn('Error al eliminar fotos del servidor FTP.');
            return res.status(400).json({ error: 'Error al eliminar fotos del servidor FTP.' });
        }
        const newImageUrl = deletedFtp.imageUrl;
        // Continúa con la lógica para actulizar en la base de datos
        const updateDb = await sendParametersForUpdate({ [campo]: newImageUrl });
        return res.status(200).json({ message: updateDb });
    } catch (error) {
        console.error('Error en el controlador deletePhotos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const updateTextCustomize = async (req, res) => {
    const { text } = req.body;

    try {
        const updateTextDb = await sendParametersForUpdateText(text);
        return res.status(200).json({ message: updateTextDb });
    } catch (error) {
        console.error('Error al actualizar:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


module.exports = {
    getCustomes,
    updateCustomize,
    updateTextCustomize
}
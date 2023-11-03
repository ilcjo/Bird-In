const {
    createZonas,
    updateZonas,
    borrarZonas,
    createFamilias,
    updateFamilias,
    borrarFamilias
} = require("../../controllers/options/optionsController");

const postZonas = async (req, res) => {
    const { zona, pais } = req.body
    try {
        const options = await createZonas(zona, pais)
        return res.status(200).json(options)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

const putZonas = async (req, res) => {
    const { idZona, zona, paisId } = req.body
    try {
        const options = await updateZonas(idZona, zona, paisId)
        return res.status(200).json(options)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

const deleteZonas = async (req, res) => {
    const { idZona } = req.query
    try {
        if (idZona) {
            const options = await borrarZonas(idZona)
            return res.status(200).json(options)
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};
const postFamilias = async (req, res) => {
    const { nombreF } = req.body
    try {
        const options = await createFamilias(nombreF)
        return res.status(200).json(options)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

const putFamilias = async (req, res) => {
    const { nombreF, idFamilia } = req.body
    try {
        const options = await updateFamilias(nombreF, idFamilia)
        return res.status(200).json(options)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

const deleteFamilias = async (req, res) => {
    const { idZona } = req.query
    try {
        if (idZona) {
            const options = await borrarFamilias(idZona)
            return res.status(200).json(options)
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

module.exports = {
    postZonas,
    putZonas,
    deleteZonas,
    postFamilias,
    putFamilias,
    deleteFamilias
}
const { createZonas, updateZonas, borrarZonas } = require("../../../controllers/settings/custome/CountryZoneController");

const postZonas = async (req, res) => {
    const { zona, pais } = req.body
    typeof (pais)
    try {
        if (zona && !isNaN(pais) && typeof pais === 'number') {
            const options = await createZonas(zona, pais);
            return res.status(200).json(options);
        }
        return res.status(400).json('Faltan parámetros zona y/o país');

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
module.exports = {
    postZonas,
    putZonas,
    deleteZonas,
}
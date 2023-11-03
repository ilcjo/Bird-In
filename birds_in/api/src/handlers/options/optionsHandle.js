const { getAllZonas, createZonas } = require("../../controllers/options/optionsController");

const getZonas = async (req, res) => {
    try {
        const getAllOptions = await getAllZonas()
        return res.status(200).json(getAllOptions)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

const postZonas = async (req, res) => {
    const { zona, pais } = req.body
    try {
        const getAllOptions = await createZonas(zona, pais)
        return res.status(200).json(getAllOptions)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};


module.exports = {
    getZonas,
    postZonas
}
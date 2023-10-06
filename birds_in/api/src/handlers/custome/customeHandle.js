const {
    fetchCustome,
    sendParametersForUpdate
} = require("../../controllers/custome/customeController");

const getCustomes = async (req, res) => {
    try {
        const allCustomizes = await fetchCustome()
        return res.status(200).json(allCustomizes);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const updateCustomize = async (req, res) => {
    const { customizationParams } = req.body
    try {
        const updated = await sendParametersForUpdate(customizationParams)
        return res.status(200).json(updated)
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getCustomes,
    updateCustomize
}
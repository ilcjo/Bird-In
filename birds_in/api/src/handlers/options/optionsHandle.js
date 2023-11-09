const {
    createZonas,
    updateZonas,
    borrarZonas,
    createFamilias,
    updateFamilias,
    borrarFamilias,
    borrarGrupos,
    createGrupos,
    updateGrupo
} = require("../../controllers/options/optionsController");

const postZonas = async (req, res) => {
    const { zona, pais } = req.body
    typeof(pais)
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
    const { idFamilia } = req.query
    try {
        if (idFamilia) {
            const options = await borrarFamilias(idFamilia)
            return res.status(200).json(options)
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

const postGrupo = async (req, res) => {
    const { nombreG } = req.body
    try {
        const options = await createGrupos(nombreG)
        return res.status(200).json(options)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

const putGrupos = async (req, res) => {
    const { nombreG, idGrupo } = req.body
    try {
        const options = await updateGrupo(nombreG, idGrupo)
        return res.status(200).json(options)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

const deleteGrupos = async (req, res) => {
    const { idGrupo } = req.query
    try {
        if (idGrupo) {
            const options = await borrarGrupos(idGrupo)
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
    deleteFamilias,
    postGrupo,
    putGrupos,
    deleteGrupos
}
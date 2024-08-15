const {
    createFamilias,
    updateFamilias,
    borrarFamilias,
    borrarGrupos,
    createGrupos,
    updateGrupo
} = require("../../../controllers/birds/Classification/ClassController");


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
    const {  nombreF, idFamilia } = req.query
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
    const {nombreG, idGrupo } = req.body
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
    postFamilias,
    putFamilias,
    deleteFamilias,
    postGrupo,
    putGrupos,
    deleteGrupos
}
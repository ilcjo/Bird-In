const { Router } = require('express')
const {
    postFamilias,
    putFamilias,
    deleteFamilias,
    postGrupo,
    putGrupos,
    deleteGrupos
} = require('../../handlers/birds/classification/classHandle')

const optionRouter = Router()
optionRouter.post('/crearfamilias', postFamilias)
    .put('/actualizarFamilias', putFamilias)
    .delete('/eliminarFamilias', deleteFamilias)
    .post('/crearGrupos', postGrupo)
    .put('/actualizarGrupos', putGrupos)
    .delete('/eliminarGrupos', deleteGrupos)
module.exports = optionRouter
const { Router } = require('express')
const {
    postZonas,
    putZonas,
    deleteZonas,
    postFamilias,
    putFamilias,
    deleteFamilias,
    postGrupo,
    putGrupos,
    deleteGrupos
} = require('../handlers/options/optionsHandle')

const optionRouter = Router()
optionRouter.post('/crearZonas', postZonas)
    .put('/actualizarZonas', putZonas)
    .delete('/eliminarZonas', deleteZonas)
    .post('/crearfamilias', postFamilias)
    .put('/actualizarFamilias', putFamilias)
    .delete('/eliminarFamilias', deleteFamilias)
    .post('/crearGrupos', postGrupo)
    .put('/actualizarGrupos', putGrupos)
    .delete('/eliminarGrupos', deleteGrupos)
module.exports = optionRouter
const { Router } = require('express')
const {
    postZonas,
    putZonas,
    deleteZonas,
    postFamilias,
    putFamilias,
    deleteFamilias
} = require('../handlers/options/optionsHandle')

const optionRouter = Router()
optionRouter.post('/crearZonas', postZonas)
    .put('/actualizarZonas', putZonas)
    .delete('/eliminarZonas', deleteZonas)
    .post('/crearfamilias', postFamilias)
    .put('/actualizarFamilias', putFamilias)
    .delete('/eliminarFamilias', deleteFamilias)
module.exports = optionRouter
const { Router } = require('express')
const { postFamilias, putFamilias, deleteFamilias, postGrupo, putGrupos, deleteGrupos } = require('../../handlers/peces/classification/classHandle')


const catePRouter = Router()
catePRouter.post('/crearfamilias', postFamilias)
    .put('/actualizarFamilias', putFamilias)
    .delete('/eliminarFamilias', deleteFamilias)
    .post('/crearGrupos', postGrupo)
    .put('/actualizarGrupos', putGrupos)
    .delete('/eliminarGrupos', deleteGrupos)
module.exports = catePRouter
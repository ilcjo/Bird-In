const { Router } = require('express')
const { postFamilias, putFamilias, deleteFamilias, postGrupo, putGrupos, deleteGrupos } = require('../../handlers/insects/classification/classHandle')


const cateIRouter = Router()
cateIRouter.post('/crearfamilias', postFamilias)
    .put('/actualizarFamilias', putFamilias)
    .delete('/eliminarFamilias', deleteFamilias)
    .post('/crearGrupos', postGrupo)
    .put('/actualizarGrupos', putGrupos)
    .delete('/eliminarGrupos', deleteGrupos)
module.exports = cateIRouter
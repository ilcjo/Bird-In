const { Router } = require('express')
const { postFamilias, putFamilias, deleteFamilias, postGrupo, putGrupos, deleteGrupos, postOrden, putOrden, deleteOrden } = require('../../handlers/reptiles/classification/classHandle')


const classRRouter = Router()
classRRouter.post('/crearfamilias', postFamilias)
    .put('/actualizarFamilias', putFamilias)
    .delete('/eliminarFamilias', deleteFamilias)
    .post('/crearGrupos', postGrupo)
    .put('/actualizarGrupos', putGrupos)
    .delete('/eliminarGrupos', deleteGrupos)
    .post('/crearOrden', postOrden)
    .put('/actualizarOrden', putOrden)
    .delete('/eliminarOrden', deleteOrden)
module.exports = classRRouter
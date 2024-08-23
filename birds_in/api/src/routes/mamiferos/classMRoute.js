const { Router } = require('express')
const { postFamilias, putFamilias, deleteFamilias, postGrupo, putGrupos, deleteGrupos } = require('../../handlers/mamiferos/classification/classHandle')


const classMRouter = Router()
classMRouter.post('/crearfamilias', postFamilias)
    .put('/actualizarFamilias', putFamilias)
    .delete('/eliminarFamilias', deleteFamilias)
    .post('/crearGrupos', postGrupo)
    .put('/actualizarGrupos', putGrupos)
    .delete('/eliminarGrupos', deleteGrupos)
module.exports = classMRouter
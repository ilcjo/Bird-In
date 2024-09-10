const { Router } = require('express')

const upload = require('../../utils/multerConfig')
const { getFilterInfo, selectOptions, getFilterOptions, createRegistro, findInfoForUpdate, findInfoForUpdateName, uploadImageftp, updateInfoRegister, deletePhotos, setCoverPhoto, contandoRegistros, deleteRegistro, checkRegisterDuplicate, getExcel, getAllNombres, checkClases, checkDuplicateNames } = require('../../handlers/reptiles/reptilesHandler')

const reptilesRouter = Router()
reptilesRouter
    .get('/filtros', getFilterInfo)
    .get('/opciones', selectOptions)
    .get('/nuevasOpciones', getFilterOptions)
    .post('/create', createRegistro)
    .post('/upload_image', upload.array('images'), uploadImageftp)
    .get('/get_update', findInfoForUpdate)
    .get('/get_update_name', findInfoForUpdateName)
    .put('/update', updateInfoRegister)
    .delete('/borrar_fotos', deletePhotos)
    .put('/foto_portada', setCoverPhoto)
    .get('/contando', contandoRegistros)
    .delete('/borrar_registro', deleteRegistro)
    .get('/duplicados', checkRegisterDuplicate)
    .get('/descargar-excel', getExcel)
    .get('/nombres', getAllNombres)
    .get('/clases', checkClases)
    .get('/gruposFamilias', checkDuplicateNames)

module.exports = reptilesRouter

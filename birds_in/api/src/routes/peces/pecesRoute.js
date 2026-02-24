const { Router } = require('express')

const upload = require('../../utils/multerConfig')
const { createFish, getFilterInfo, selectOptions, getFilterOptions, uploadImageftp, findInfoForUpdate, findInfoForUpdateName, updateInfoRegister, deletePhotos, setCoverPhoto, contandoRegistros, deleteRegistro, checkRegisterDuplicate, getExcel, getAllNombres, checkClases, checkDuplicateNames, saveOrderImages } = require('../../handlers/peces/pecesHandler')

const FishRouter = Router()
FishRouter
    .get('/filtros', getFilterInfo)
    .get('/opciones', selectOptions)
    .get('/nuevasOpciones', getFilterOptions)
    .post('/create', createFish)
    .post('/upload_image', upload.array('images'), uploadImageftp)
    .get('/get_update', findInfoForUpdate)
    .get('/get_update_name', findInfoForUpdateName)
    .put('/update', updateInfoRegister)
    .delete('/borrar_fotos', deletePhotos)
    .put('/foto_portada', setCoverPhoto)
    .get('/contando', contandoRegistros)
    .delete('/borrar_registro', deleteRegistro)
    .get('/duplicados', checkRegisterDuplicate)
    // .get('/descargar-excel-aves', getExcel)
    .get('/nombres', getAllNombres)
    .get('/clases', checkClases)
    .get('/gruposFamilias', checkDuplicateNames)
    .post('/guardar_orden_images', saveOrderImages)



module.exports = FishRouter

const { Router } = require('express')

const upload = require('../../utils/multerConfig')
const { createInsect, getFilterInfo, selectOptions, getFilterOptions, uploadImageftp, findInfoForUpdate, findInfoForUpdateName, updateInfoRegister, deletePhotos, setCoverPhoto, contandoRegistros, deleteRegistro, checkRegisterDuplicate } = require('../../handlers/insects/insectHandler')

const InsectRouter = Router()
InsectRouter
    .get('/filtros', getFilterInfo)
    .get('/opciones', selectOptions)
    .get('/nuevasOpciones', getFilterOptions)
    .post('/create', createInsect)
    .post('/upload_image', upload.array('images'), uploadImageftp)//pendiente de probar
    .get('/get_update', findInfoForUpdate)
    .get('/get_update_name', findInfoForUpdateName)
    .put('/update', updateInfoRegister)
    .delete('/borrar_fotos', deletePhotos)//por probar
    .put('/foto_portada', setCoverPhoto)
    .get('/contando', contandoRegistros)
    .delete('/borrar_registro', deleteRegistro)//por probar
    .get('/duplicados', checkRegisterDuplicate)
// .get('/descargar-excel-aves', getAllAvesAsExcel); //PENDIENTE POR HACER TABLA

module.exports = InsectRouter

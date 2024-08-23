const { Router } = require('express')

const upload = require('../../utils/multerConfig')
const { getFilterInfo, selectOptions, getFilterOptions, createRegistro, findInfoForUpdate, findInfoForUpdateName, uploadImageftp, updateInfoRegister, deletePhotos, setCoverPhoto, contandoRegistros, deleteRegistro, checkRegisterDuplicate } = require('../../handlers/reptiles/reptilesHandler')

const reptilesRouter = Router()
reptilesRouter
    .get('/filtros', getFilterInfo)
    .get('/opciones', selectOptions)
    .get('/nuevasOpciones', getFilterOptions)//no funciono
    .post('/create', createRegistro)
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

module.exports = reptilesRouter

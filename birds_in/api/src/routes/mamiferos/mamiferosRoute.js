const { Router } = require('express')

const upload = require('../../utils/multerConfig')
const { getFilterInfo, selectOptions, getFilterOptions, createMamifero, uploadImageftp, findInfoForUpdate, findInfoForUpdateName, updateInfoRegister, deletePhotos, setCoverPhoto, contandoRegistros, deleteRegistro, checkRegisterDuplicate, getAllNombres, checkClases, checkDuplicateNames, getExcel } = require('../../handlers/mamiferos/mamiferoHandler')

const MamiferoRouter = Router()
MamiferoRouter
    .get('/filtros', getFilterInfo)
    .get('/opciones', selectOptions)
    .get('/nuevasOpciones', getFilterOptions)
    .post('/create', createMamifero)
    .post('/upload_image', upload.array('images'), uploadImageftp)//pendiente de probar
    .get('/get_update', findInfoForUpdate)
    .get('/get_update_name', findInfoForUpdateName)
    .put('/update', updateInfoRegister)
    .delete('/borrar_fotos', deletePhotos)//por probar
    .put('/foto_portada', setCoverPhoto)
    .get('/contando', contandoRegistros)
    .delete('/borrar_registro', deleteRegistro)//por probar
    .get('/duplicados', checkRegisterDuplicate)
    .get('/descargar-excel', getExcel) //PENDIENTE POR HACER TABLA
    .get('/nombres', getAllNombres)
    .get('/clases', checkClases)
    .get('/gruposFamilias', checkDuplicateNames)
module.exports = MamiferoRouter

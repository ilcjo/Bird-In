const { Router } = require('express')
const {
    getFilterInfo,
    selectOptions,
    getFilterOptions,
    createBird,
    uploadImageftp,
    findInfoForUpdate,
    updateInfoBids,
    deletePhotos,
    setCoverPhoto,
    contandoRegistros,
    deleteBird,
    findInfoForUpdateName,
    checkBirdDuplicate,
    getAllAvesAsExcel,
    getAllNombres,
    check,
    checkClases,
    checkDuplicateNames

} = require('../../handlers/birds/birdHandler')
const upload = require('../../utils/multerConfig')

const birdsRouter = Router()
birdsRouter.get('/filtros', getFilterInfo)
    .get('/opciones', selectOptions)
    .get('/nuevasOpciones', getFilterOptions)
    .post('/create', createBird)
    .post('/upload_image', upload.array('images'), uploadImageftp)
    .get('/get_update', findInfoForUpdate)
    .get('/get_update_name', findInfoForUpdateName)
    .put('/update', updateInfoBids)
    .delete('/borrar_fotos', deletePhotos)
    .put('/foto_portada', setCoverPhoto)
    .get('/contando', contandoRegistros)
    .delete('/borrar_ave', deleteBird)
    .get('/duplicados', checkBirdDuplicate)
    .get('/descargar-excel-aves', getAllAvesAsExcel)
    .get('/nombres', getAllNombres)
    .get('/check', check)
    .get('/clases', checkClases )
    .get('/gruposFamilias', checkDuplicateNames)

module.exports = birdsRouter

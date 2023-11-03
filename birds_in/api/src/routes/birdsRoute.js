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
    contandoRegistros

} = require('../handlers/birds/birdHandler')
const upload = require('../utils/multerConfig')

const birdsRouter = Router()
birdsRouter.get('/filtros', getFilterInfo)
    .get('/opciones', selectOptions)
    .get('/nuevasOpciones', getFilterOptions)
    .post('/create', createBird)
    .post('/upload_image', upload.array('images'), uploadImageftp)
    .get('/get_update', findInfoForUpdate)
    .put('/update', updateInfoBids)
    .delete('/borrar_fotos', deletePhotos)
    .put('/foto_portada', setCoverPhoto)
    .get('/contando', contandoRegistros)
module.exports = birdsRouter
const { Router } = require('express')
const {
    getFilterInfo,
    selectOptions,
    getFilterOptions,
    createBird,
    uploadImageftp,
    findInfoForUpdate,
    updateInfoBids} = require('../handlers/birds/birdHandler')
const upload = require('../utils/multerConfig')

const birdsRouter = Router()
birdsRouter.get('/filtros', getFilterInfo)
    .get('/opciones', selectOptions)
    .get('/nuevasOpciones', getFilterOptions)
    .post('/create', createBird)
    .post('/upload_image', upload.single('image'), uploadImageftp)
    .get('/get_update', findInfoForUpdate)
    .put('/update', updateInfoBids)
module.exports = birdsRouter
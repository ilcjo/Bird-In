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
} = require('../../handlers/birds/birdHandler')
const upload = require('../../utils/multerConfig')
const { 
    checkLandsDuplicate, 
    uploadImageftpPaisajes, 
    createLand,
    findInfoForUpdateNameP,
    findInfoForUpdateP,
    getFilterInfoP,
    setCoverPhotoP,
    deletePhotosPaisajes
} = require('../../handlers/Lands/landsHandler')

const landsRouter = Router()
landsRouter.get('/filtros', getFilterInfoP)
    .get('/opciones', selectOptions)
    .get('/nuevasOpciones', getFilterOptions)
    .post('/create', createLand)
    .post('/upload_image', upload.array('images'), uploadImageftpPaisajes)
    .get('/get_update', findInfoForUpdateP)
    .get('/get_update_name', findInfoForUpdateNameP)
    .put('/update', updateInfoBids)
    .delete('/borrar_fotos', deletePhotosPaisajes)
    .put('/foto_portada', setCoverPhotoP)
    .get('/contando', contandoRegistros)
    .delete('/borrar_ave', deleteBird)
    .get('/duplicados', checkLandsDuplicate)
    
module.exports = landsRouter

const { Router } = require('express')
const upload = require('../../utils/multerConfig')
const { 
    checkLandsDuplicate, 
    uploadImageftpPaisajes, 
    createLand,
    findInfoForUpdateNameP,
    findInfoForUpdateP,
    getFilterInfoP,
    setCoverPhotoP,
    deletePhotosPaisajes,
    updateInfoPaisaje,
    deletePaisaje,
    selectOptionsP,
    getFilterOptionsP
} = require('../../handlers/Lands/landsHandler')

const landsRouter = Router()
landsRouter.get('/filtros', getFilterInfoP)
    .get('/opciones', selectOptionsP)
    .get('/nuevasOpciones', getFilterOptionsP)
    .post('/create', createLand)
    .post('/upload_image', upload.array('images'), uploadImageftpPaisajes)
    .get('/get_update', findInfoForUpdateP)
    .get('/get_update_name', findInfoForUpdateNameP)
    .put('/update', updateInfoPaisaje)
    .delete('/borrar_fotos', deletePhotosPaisajes)
    .put('/foto_portada', setCoverPhotoP)
    // .get('/contando', contandoRegistros)
    .delete('/borrar_registro', deletePaisaje)
    .get('/duplicados', checkLandsDuplicate)
    
module.exports = landsRouter

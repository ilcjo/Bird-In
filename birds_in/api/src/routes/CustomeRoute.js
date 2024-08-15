const { Router } = require('express')
const upload = require('../utils/multerConfig')
const { updateCustomize, updateTextCustomize, getCustomes } = require('../handlers/settings/custome/customeHandle')

const customeRouter = Router()
customeRouter.get('/', getCustomes)
    .post('/update', upload.single('file'), updateCustomize)
    .post('/updateText', updateTextCustomize)
module.exports = customeRouter


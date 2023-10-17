const { Router } = require('express')
const { getCustomes, updateCustomize, updateTextCustomize } = require('../handlers/custome/customeHandle')
const upload = require('../utils/multerConfig')

const customeRouter = Router()
customeRouter.get('/', getCustomes)
    .post('/update', upload.single('file'), updateCustomize)
    .post('/updateText', updateTextCustomize)
module.exports = customeRouter


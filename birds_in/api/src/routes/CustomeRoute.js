const { Router } = require('express')
const { getCustomes, updateCustomize } = require('../handlers/custome/customeHandle')
const upload = require('../utils/multerConfig')

const customeRouter = Router()
customeRouter.get('/', getCustomes)
.post('/update', upload.single('file'),updateCustomize)

module.exports = customeRouter


const { Router } = require('express')
const { getZonas, postZonas } = require('../handlers/options/optionsHandle')

const optionRouter = Router()
optionRouter.get('/', getZonas)
.post('/crear', postZonas)
module.exports = optionRouter
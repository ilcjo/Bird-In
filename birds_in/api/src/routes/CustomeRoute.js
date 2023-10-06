const { Router } = require('express')
const { getCustomes, updateCustomize } = require('../handlers/custome/customeHandle')


const customeRouter = Router()
customeRouter.get('/', getCustomes)
.put('/update', updateCustomize)

module.exports = customeRouter


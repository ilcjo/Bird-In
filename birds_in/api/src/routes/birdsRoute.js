const { Router } = require('express')
const { getAllBirds, getFilterInfo } = require('../handlers/birds/birdHandler')

const birdsRouter = Router()
birdsRouter.get('/', getAllBirds).get('/filtros', getFilterInfo)
module.exports = birdsRouter
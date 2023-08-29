const { Router } = require('express')
const {
    getAllBirds,
    getFilterInfo,
    selectOptions,
    getFilterOptions } = require('../handlers/birds/birdHandler')

const birdsRouter = Router()
birdsRouter.get('/', getAllBirds).get('/filtros', getFilterInfo).get('/opciones', selectOptions).get('/nuevasOpciones', getFilterOptions)
module.exports = birdsRouter
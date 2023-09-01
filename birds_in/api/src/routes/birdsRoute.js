const { Router } = require('express')
const {
    getFilterInfo,
    selectOptions,
    getFilterOptions } = require('../handlers/birds/birdHandler')

const birdsRouter = Router()
birdsRouter.get('/filtros', getFilterInfo).get('/opciones', selectOptions).get('/nuevasOpciones', getFilterOptions)
module.exports = birdsRouter
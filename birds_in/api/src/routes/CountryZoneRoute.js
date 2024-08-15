const { Router } = require('express')
const { postZonas, putZonas, deleteZonas } = require("../handlers/settings/custome/ContryZoneHandle")

const CountryZoneRouter = Router()
CountryZoneRouter.post('/crearZonas', postZonas)
    .put('/actualizarZonas', putZonas)
    .delete('/eliminarZonas', deleteZonas)
module.exports = CountryZoneRouter
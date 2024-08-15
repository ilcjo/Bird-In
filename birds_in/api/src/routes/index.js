const { Router } = require('express');
const birdsRouter = require('./birds/birdsRoute');
const userRouter = require('./users/userRoutes');
const classRouter = require('./birds/classRoute');
const landsRouter = require('./Lands/landsRoute');
const animalsRouter = require('./animals/animalsRoute');
const customeRouter = require('./CustomeRoute');
const CountryZoneRouter = require('./CountryZoneRoute');

const mainRouter = Router();

mainRouter.use('/', userRouter)
mainRouter.use('/personalizar', customeRouter)
mainRouter.use('/aves', birdsRouter)
mainRouter.use('/opciones', classRouter)
mainRouter.use('/paisajes', landsRouter)
mainRouter.use('/animales', animalsRouter)
mainRouter.use('/geo', CountryZoneRouter)
module.exports = mainRouter
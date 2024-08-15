const { Router } = require('express');
const birdsRouter = require('./birds/birdsRoute');
const userRouter = require('./users/userRoutes');
const optionRouter = require('./birds/optionRoute');
const landsRouter = require('./Lands/landsRoute');
const animalsRouter = require('./animals/animalsRoute');
const customeRouter = require('./CustomeRoute');


const mainRouter = Router();

mainRouter.use('/', userRouter)
mainRouter.use('/personalizar', customeRouter)
mainRouter.use('/aves', birdsRouter)
mainRouter.use('/opciones', optionRouter)
mainRouter.use('/paisajes', landsRouter)
mainRouter.use('/animales', animalsRouter)
module.exports = mainRouter
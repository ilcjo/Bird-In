const { Router } = require('express');
const birdsRouter = require('./birds/birdsRoute');
const userRouter = require('./users/userRoutes');
const customeRouter = require('./birds/CustomeRoute');
const optionRouter = require('./birds/optionRoute');
const landsRouter = require('./Lands/landsRoute');


const mainRouter = Router();

mainRouter.use('/', userRouter)
mainRouter.use('/personalizar', customeRouter)
mainRouter.use('/aves', birdsRouter)
mainRouter.use('/opciones', optionRouter)
mainRouter.use('/paisajes', landsRouter)
module.exports = mainRouter
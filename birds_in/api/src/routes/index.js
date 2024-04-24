const { Router } = require('express');
const birdsRouter = require('./birds/birdsRoute');
const userRouter = require('./users/userRoutes');
const customeRouter = require('./birds/CustomeRoute');
const optionRouter = require('./birds/optionRoute');


const mainRouter = Router();

mainRouter.use('/aves', birdsRouter)
mainRouter.use('/', userRouter)
mainRouter.use('/personalizar', customeRouter)
mainRouter.use('/opciones', optionRouter)

module.exports = mainRouter
const { Router } = require('express');
const birdsRouter = require('./birdsRoute');
const userRouter = require('./userRoutes');
const customeRouter = require('./CustomeRoute');
const optionRouter = require('./optionRoute');



const mainRouter = Router();

mainRouter.use('/aves', birdsRouter)
mainRouter.use('/', userRouter)
mainRouter.use('/personalizar', customeRouter)
mainRouter.use('/opciones', optionRouter )

module.exports = mainRouter
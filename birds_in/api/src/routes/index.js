const { Router } = require('express');
const birdsRouter = require('./birdsRoute');
const userRouter = require('./userRoutes');
const customeRouter = require('./CustomeRoute');



const mainRouter = Router();

mainRouter.use('/aves', birdsRouter)
mainRouter.use('/', userRouter)
mainRouter.use('/personalizar', customeRouter)

module.exports = mainRouter
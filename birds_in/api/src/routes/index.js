const { Router } = require('express');
const birdsRouter = require('./birdsRoute');
const userRouter = require('./userRoutes');


const mainRouter = Router();

mainRouter.use('/aves', birdsRouter)
mainRouter.use('/', userRouter)

module.exports = mainRouter
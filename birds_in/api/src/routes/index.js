const { Router } = require('express');
const birdsRouter = require('./birdsRoute');


const mainRouter = Router();

mainRouter.use('/aves', birdsRouter)

module.exports = mainRouter
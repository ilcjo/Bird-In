const { Router } = require('express');
const birdsRouter = require('./birds/birdsRoute');
const userRouter = require('./users/userRoutes');
const classRouter = require('./birds/classRoute');
const landsRouter = require('./Lands/landsRoute');
const animalsRouter = require('./animals/animalsRoute');
const customeRouter = require('./CustomeRoute');
const CountryZoneRouter = require('./CountryZoneRoute');
const InsectRouter = require('./insects/insectsRoute');
const cateIRouter = require('./insects/classIRoute');
const MamiferoRouter = require('./mamiferos/mamiferosRoute');
const classMRouter = require('./mamiferos/classMRoute');
const reptilesRouter = require('./reptiles/reptilesRoute');
const classRRouter = require('./reptiles/classRRoute');

const mainRouter = Router();

mainRouter.use('/', userRouter)
mainRouter.use('/personalizar', customeRouter)
mainRouter.use('/aves', birdsRouter)
mainRouter.use('/opciones', classRouter)
mainRouter.use('/paisajes', landsRouter)
mainRouter.use('/animales', animalsRouter)
mainRouter.use('/geo', CountryZoneRouter)
mainRouter.use('/insectos', InsectRouter)
mainRouter.use('/insectos/clasificacion', cateIRouter)
mainRouter.use('/mamiferos', MamiferoRouter)
mainRouter.use('/mamiferos/clasificacion', classMRouter )
mainRouter.use('/reptiles', reptilesRouter)
mainRouter.use('/reptiles/clasificacion', classRRouter )
module.exports = mainRouter
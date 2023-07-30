import express from 'express'
import morgan from 'morgan'
    // import mainRoutes from './routes/index'

import './db/db.js'

const server = express();
const serverName = 'APIBird';
server.set('serverName', serverName);

server.use(express.urlencoded({ extended: true, limit: '50mb' }));
server.use(express.json({ limit: '50mb' }));
server.use(morgan('dev'));

// server.use('/', mainRoutes);

// Error catching endware.
server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

export default server;

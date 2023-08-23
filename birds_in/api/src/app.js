const express = require('express');
const morgan = require('morgan');
// const mainRoutes = require('./routes/index');

require('./db/db.js');

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

module.exports = server;


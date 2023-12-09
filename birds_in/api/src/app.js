const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mainRoutes = require('./routes/index');

require('./db/db.js');

const server = express();
const serverName = 'APIBird';
server.set('serverName', serverName);

server.use(cookieParser());
server.use(express.urlencoded({ extended: true, limit: '50mb' }));
server.use(express.json({ limit: '50mb' }));
server.use(morgan('dev'));


// Configurar CORS para permitir solo desde el frontend seguro
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

server.use('/', mainRoutes);

// Error catching endware.
server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});




module.exports = server;


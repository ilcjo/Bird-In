const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } = process.env;

const sequelize = new Sequelize(`mariadb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
  logging: console.log,
  dialectOptions: {
    connectTimeout: 30000,
  },
  define: {
    freezeTableName: true,
  },
});

// Prueba la conexión a la base de datos
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
})();

const models = {};
const modelsDir = path.join(__dirname, '..', '..', 'models');

// Carga de modelos desde las subcarpetas
fs.readdirSync(modelsDir).forEach(dir => {
  const fullPath = path.join(modelsDir, dir);

  if (fs.lstatSync(fullPath).isDirectory()) {
    fs.readdirSync(fullPath)
      .filter(file => file.slice(-3) === '.js')
      .forEach(file => {
        const model = require(path.join(fullPath, file))(sequelize);
        models[model.name] = model;
      });
  } else if (fullPath.slice(-3) === '.js') {
    const model = require(fullPath)(sequelize);
    models[model.name] = model;
  }
});

// Asociaciones de modelos
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  ...models,
  conn: sequelize,
};

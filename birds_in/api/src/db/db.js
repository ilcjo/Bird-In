require('dotenv').config();

const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME,
  DB_PORT
} = process.env

const db = new Sequelize(`mariadb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
  logging: console.log,
  dialectOptions: {
    connectTimeout: 30000, // Aumenta el tiempo de conexión a 30 segundos (30000 ms)
  },
  define: {
    freezeTableName: true
  }
});
// Prueba la conexión a la base de datos
(async () => {
  try {
    await db.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    // Ejemplo de consulta de prueba
    // const birds = await db.query('SELECT * FROM tempo_info', { type: Sequelize.QueryTypes.SELECT });
    // console.log(birds); // Deberías ver los registros de la tabla "users" si la consulta fue exitosa.

  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
})();

const basename = path.basename(__filename);
const modelDefiners = [];

fs.readdirSync(path.join(__dirname, '..', 'models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '..', 'models', file)));
  });

// Injectamos la conexión (sequelize) a todos los modelos
modelDefiners.forEach(model => model(db));

// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(db.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
db.models = Object.fromEntries(capsEntries)

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Aves, Familias, Grupos, Imagenes_aves, Nombres_comunes, Paises, Urls_externas, Usuarios } = db.models;
// UNO A UNO
Aves.belongsTo(Familias, { foreignKey: 'familias_id_familia' })
Familias.hasOne(Aves, { foreignKey: 'familias_id_familia' })
Aves.belongsTo(Grupos, { foreignKey: 'grupos_id_grupo' })
Grupos.hasOne(Aves, { foreignKey: 'grupos_id_grupo' })
// UNO A MUCHOS
Aves.hasMany(Imagenes_aves, { foreignKey: 'aves_id_ave' })
Aves.hasMany(Nombres_comunes, { foreignKey: 'aves_id_ave' })
Aves.hasMany(Urls_externas, { foreignKey: 'aves_id_ave' })
// MUCHOS A MUCHOS
Aves.belongsToMany(Paises, { through: 'aves_has_paises', foreignKey: 'aves_id_ave' })
Paises.belongsToMany(Aves, { through: 'aves_has_paises', foreignKey: 'paises_id_pais' })

module.exports = {
  ...db.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: db,     // para importart la conexión { conn } = require('./db.js');
}
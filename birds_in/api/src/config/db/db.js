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
  // logging: console.log,
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

fs.readdirSync(path.join(__dirname, '..', '..', 'models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '..', '..', 'models', file)));
  });

// Injectamos la conexión (sequelize) a todos los modelos
modelDefiners.forEach(model => model(db));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(db.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
db.models = Object.fromEntries(capsEntries)
// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const {
  Paises, Usuarios, Customize_page, Zonas, Token, VistaAvesOrdenadaAll,
  Paisajes, Imagenes_paisajes,
  Aves, Familias, Grupos, Imagenes_aves,
  Mamiferos, Grupos_mamiferos, Familias_mamiferos, Imagenes_mamiferos,
  Reptiles, Grupos_reptiles, Familias_reptiles, Imagenes_reptiles,
  Insectos, Grupos_insectos, Familias_insectos, Imagenes_insectos
} = db.models;
// console.log(db.models)
// UNO A UNO

// =>AVES
Aves.belongsTo(Familias, { foreignKey: 'familias_id_familia' })
Familias.hasOne(Aves, { foreignKey: 'familias_id_familia' })
Aves.belongsTo(Grupos, { foreignKey: 'grupos_id_grupo' })
Grupos.hasOne(Aves, { foreignKey: 'grupos_id_grupo' })
// =>PAISAJES
Paisajes.belongsTo(Paises, { foreignKey: 'paises_id_pais' });
Paises.hasOne(Paisajes, { foreignKey: 'paises_id_pais' });
Paisajes.belongsTo(Zonas, { foreignKey: 'zonas_id_zona' });
Zonas.hasOne(Paisajes, { foreignKey: 'zonas_id_zona' });
// =>MAMÍFEROS
Mamiferos.belongsTo(Familias_mamiferos, { foreignKey: 'familias_id_familia' })
Familias_mamiferos.hasOne(Mamiferos, { foreignKey: 'familias_id_familia' })
Mamiferos.belongsTo(Grupos_mamiferos, { foreignKey: 'grupos_id_grupo' })
Grupos_mamiferos.hasOne(Mamiferos, { foreignKey: 'grupos_id_grupo' })
// =>REPTILES
Reptiles.belongsTo(Familias_reptiles, { foreignKey: 'familias_id_familia' })
Familias_reptiles.hasOne(Reptiles, { foreignKey: 'familias_id_familia' })
Reptiles.belongsTo(Grupos_reptiles, { foreignKey: 'grupos_id_grupo' })
Grupos_reptiles.hasOne(Reptiles, { foreignKey: 'grupos_id_grupo' })
// // =>INSECTOS
Insectos.belongsTo(Familias_insectos, { foreignKey: 'familias_id_familia' })
Familias_insectos.hasOne(Insectos, { foreignKey: 'familias_id_familia' })
Insectos.belongsTo(Grupos_insectos, { foreignKey: 'grupos_id_grupo' })
Grupos_insectos.hasOne(Insectos, { foreignKey: 'grupos_id_grupo' })

// UNO A MUCHOS

//IMÁGENES AVES
Aves.hasMany(Imagenes_aves, { foreignKey: 'aves_id_ave' })
Imagenes_aves.belongsTo(Aves, { foreignKey: 'aves_id_ave' })
//IMÁGENES PAISAJES
Paisajes.hasMany(Imagenes_paisajes, { foreignKey: 'paisajes_id_paisaje' })
Imagenes_paisajes.belongsTo(Paisajes, { foreignKey: 'paisajes_id_paisaje' })
//IMÁGENES MAMIFEROS
Mamiferos.hasMany(Imagenes_mamiferos, { foreignKey: 'mamiferos_id_mamifero' })
Imagenes_mamiferos.belongsTo(Mamiferos, { foreignKey: 'mamiferos_id_mamifero' })
//IMÁGENES REPTILES
Reptiles.hasMany(Imagenes_reptiles, { foreignKey: 'reptiles_id_reptil' })
Imagenes_reptiles.belongsTo(Reptiles, { foreignKey: 'reptiles_id_reptil' })
//INSECTOS
Insectos.hasMany(Imagenes_insectos, { foreignKey: 'insectos_id_insecto' })
Imagenes_insectos.belongsTo(Insectos, { foreignKey: 'insectos_id_insecto' })

//ZONAS PAISAJES
Zonas.hasMany(Paisajes, { foreignKey: 'zonas_id_zona', as: 'zonasPaisajes' });
Paisajes.belongsTo(Zonas, { foreignKey: 'zonas_id_zona' });
//PAÍSES PAISAJES
Paises.hasMany(Paisajes, { foreignKey: 'paises_id_pais', as: 'paisesPaisajes' });
Paisajes.belongsTo(Paises, { foreignKey: 'paises_id_pais' });

//PAIS-ZONA
Zonas.hasMany(Paises, { foreignKey: 'id_paises', as: 'zonasPaises' });
Paises.belongsTo(Zonas, { foreignKey: 'id_paises' });

// MUCHOS A MUCHOS

//PaisesAves (AVES)
Aves.belongsToMany(Paises, { through: 'aves_has_paises', foreignKey: 'aves_id_ave', timestamps: false })
Paises.belongsToMany(Aves, { through: 'aves_has_paises', foreignKey: 'paises_id_pais', timestamps: false })
//ZonasAves
Aves.belongsToMany(Zonas, { through: 'aves_has_zonas', foreignKey: 'aves_id_ave', timestamps: false, as: 'zonasAves' })
Zonas.belongsToMany(Aves, { through: 'aves_has_zonas', foreignKey: 'zonas_id_zona', timestamps: false, as: 'zoAves' })
//PaisesMamiferos (MAMIFEROS)
Mamiferos.belongsToMany(Paises, { through: 'mamiferos_has_paises', foreignKey: 'mamiferos_id_mamifero', timestamps: false })
Paises.belongsToMany(Mamiferos, { through: 'mamiferos_has_paises', foreignKey: 'paises_id_pais', timestamps: false })
//ZonasMamiferos
Mamiferos.belongsToMany(Zonas, { through: 'mamiferos_has_zonas', foreignKey: 'mamiferos_id_mamifero', timestamps: false, as: 'zonasMamiferos' })
Zonas.belongsToMany(Mamiferos, { through: 'mamiferos_has_zonas', foreignKey: 'zonas_id_zona', timestamps: false, as: 'zoMamiferos' })
//PaisesReptiles (REPTILES)
Reptiles.belongsToMany(Paises, { through: 'reptiles_has_paises', foreignKey: 'reptiles_id_reptil', timestamps: false })
Paises.belongsToMany(Reptiles, { through: 'reptiles_has_paises', foreignKey: 'paises_id_pais', timestamps: false })
//ZonasReptiles
Reptiles.belongsToMany(Zonas, { through: 'reptiles_has_zonas', foreignKey: 'reptiles_id_reptil', timestamps: false, as: 'zonasReptiles' })
Zonas.belongsToMany(Reptiles, { through: 'reptiles_has_zonas', foreignKey: 'zonas_id_zona', timestamps: false, as: 'zoReptiles' })
//PaisesInsectos (INSECTOS)
Insectos.belongsToMany(Paises, { through: 'insectos_has_paises', foreignKey: 'insectos_id_insecto', timestamps: false })
Paises.belongsToMany(Insectos, { through: 'insectos_has_paises', foreignKey: 'paises_id_pais', timestamps: false })
//ZonasInsectos
Insectos.belongsToMany(Zonas, { through: 'insectos_has_zonas', foreignKey: 'insectos_id_insecto', timestamps: false, as: 'zonasInsectos' })
Zonas.belongsToMany(Insectos, { through: 'insectos_has_zonas', foreignKey: 'zonas_id_zona', timestamps: false, as: 'zoInsectos' })



module.exports = {
  ...db.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: db,     // para importar la conexión { conn } = require('./db.js');
}
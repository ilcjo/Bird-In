import 'dotenv/config';
import { Sequelize } from 'sequelize'
  // import fs from 'fs';
  // import path from 'path';
const {
    DB_USER, 
    DB_PASSWORD, 
    DB_HOST, 
    DB_NAME, 
    DB_PORT
} = process.env

const db = new Sequelize (`mariadb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,{
    logging: console.log,
    define: {
        freezeTableName: true
    }
});
// Prueba la conexión a la base de datos
(async () => {
    try {
      await db.authenticate();
      console.log('Conexión a la base de datos establecida correctamente.');
  
    //   // Ejemplo de consulta de prueba
    //   const birds = await db.query('SELECT * FROM tempo_info', { type: Sequelize.QueryTypes.SELECT });
    //   console.log(birds); // Deberías ver los registros de la tabla "users" si la consulta fue exitosa.
  
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error);
    }
  })();
  

// const basename = path.basename(new URL(import.meta.url).pathname);

// const modelDefiners = [];

// // Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
// fs.readdirSync(path.join(new URL(import.meta.url).pathname, 'models'))
//     .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
//     .forEach(async (file) => {
//         const model = (await import(path.join(new URL(import.meta.url).pathname, 'models', file))).default;
//         modelDefiners.push(model);
//     });

// // Injectamos la conexion (sequelize) a todos los modelos
// modelDefiners.forEach(model => model(db));
// // Capitalizamos los nombres de los modelos ie: product => Product
// let entries = Object.entries(db.models);
// let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
// db.models = Object.fromEntries(capsEntries);

// // En sequelize.models están todos los modelos importados como propiedades
// // Para relacionarlos hacemos un destructuring
// const { } = db.models;




export {
     db as conn }
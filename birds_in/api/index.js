const server = require('./src/server.js');
const { conn } = require('./src/config/db/db.js');

// Syncing all the models at once.
conn.sync({ force: false }).then(() => {
  server.listen(3001, () => {
    console.log('%s listening at 3001'); // eslint-disable-line no-console
  });
});
// conn.sync({ force: false }).then(() => {
//   const PORT = process.env.PORT || 3001;
//   server.listen(PORT, () => {
//     console.log(`Server listening at http://localhost:${PORT}`);
//   });
// });


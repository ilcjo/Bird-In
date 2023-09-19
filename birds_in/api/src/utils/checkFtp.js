const ftp = require('basic-ftp');

async function checkFTPConnection() {
  const client = new ftp.Client();

  try {
    await client.access({
        host: 'ftp.hotelparque97.com',
        user: 'dev_bird@lasavesquepasaronpormisojos.com',
        password: 'Leon1316',
        secure: false, 
    });

    // Si la conexión se establece correctamente, puedes hacer alguna operación de prueba, como listar directorios
    const list = await client.list();
    console.log('Conexión FTP establecida con éxito:', list);

    return true; // Devuelve true si la conexión es exitosa
  } catch (error) {
    console.error('Error al conectarse al servidor FTP:', error);
    return false; // Devuelve false si hay un error en la conexión
  } finally {
    await client.close(); // Cierra la conexión, independientemente de si tuvo éxito o no
  }
}

// Llama a la función para verificar la conexión al FTP
checkFTPConnection().then((connected) => {
  if (connected) {
    console.log('La conexión al FTP se estableció con éxito.');
  } else {
    console.log('No se pudo establecer la conexión al FTP.');
  }
});

module.exports = checkFTPConnection;
const multer = require('multer');

// Configura multer para gestionar el almacenamiento de archivos
const storage = multer.diskStorage({
  destination: 'uploads/', // Carpeta donde se guardarán los archivos
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;

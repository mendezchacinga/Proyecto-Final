const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/ContactController');

const multer = require('multer');

// Configuración de multer para manejar el archivo
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Carpeta donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Ruta para enviar el formulario de contacto y registrar el voto
router.post('/enviar', upload.single('archivo'), ContactController.enviarContacto);

router.get('/contactos', ContactController.obtenerContactos);


module.exports = router;

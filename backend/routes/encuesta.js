const express = require('express');
const router = express.Router();
const EncuestaController = require('../controllers/encuestaController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas de encuestas

// Obtener todas las encuestas (accesible para todos los roles)
router.get('/', EncuestaController.getAllEncuestas);

// Crear una nueva encuesta (solo accesible para administradores)
router.post('/', authMiddleware(['admin']), EncuestaController.createEncuesta);

// Actualizar una encuesta (solo accesible para administradores)
router.put('/:id', authMiddleware(['admin']), EncuestaController.updateEncuesta);

// Eliminar una encuesta (solo accesible para administradores)
router.delete('/:id', authMiddleware(['admin']), EncuestaController.deleteEncuesta);

// Votar en una encuesta (accesible para todos los usuarios autenticados)
router.post('/:id/votar', authMiddleware(['user', 'moderator', 'admin']), EncuestaController.voteEncuesta);

module.exports = router;

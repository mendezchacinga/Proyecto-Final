const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();

// Rutas CRUD para usuarios
router.get('/', UserController.getAllUsers); // Obtener todos los usuarios
router.get('/:id', UserController.getUserById); // Obtener un usuario por ID
router.put('/:id', UserController.updateUser); // Actualizar un usuario por ID
router.delete('/:id', UserController.deleteUser); // Eliminar un usuario por ID

module.exports = router;

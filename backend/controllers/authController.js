const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
  // Registro de usuario
  static async register(req, res) {
    try {
      const { username, email, password, role } = req.body;
    
      // Crear usuario sin hashear la contraseña manualmente
      const user = new User({ username, email, password, role });
      
      // Guardar el usuario en la base de datos
      await user.save();  
      
      res.json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
      console.error('Error al registrar usuario:', error.message);
      res.status(400).json({ error: error.message });
    }
  }

  // Inicio de sesión
  static async login(req, res) {
    try {
      const { email, password } = req.body;
  
      // Buscar el usuario por su correo electrónico
      const user = await User.findOne({ email });
      if (!user) {
        console.log('Usuario no encontrado');
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
    
      // Verificar si la contraseña es válida
      const isPasswordValid = await user.comparePassword(password);  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
  
      // Generar el token JWT
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h', // El token expira en una hora
      });
  
      console.log('Inicio de sesión exitoso para:', user.username);
      res.json({ token });
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error.message);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  }
}

module.exports = AuthController;

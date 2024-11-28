const User = require('../models/User');

class UserController {
  // Obtener todos los usuarios
  static async getAllUsers(req, res) {
    try {
      const users = await User.find({}, '-password'); // Excluir la contraseña
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  }

  // Obtener un usuario por ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id, '-password'); // Excluir la contraseña
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el usuario' });
    }
  }

  // Actualizar un usuario
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { username, email, role, active } = req.body;

      const user = await User.findByIdAndUpdate(
        id,
        { username, email, role, active },
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json({ message: 'Usuario actualizado correctamente', user });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar el usuario' });
    }
  }

  // Eliminar un usuario
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
  }
}

module.exports = UserController;

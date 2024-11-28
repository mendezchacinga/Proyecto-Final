const Encuesta = require('../models/Encuestas');

class EncuestaController {
  // Obtener todas las encuestas
  static async getAllEncuestas(req, res) {
    try {
      const encuestas = await Encuesta.find();
      res.status(200).json(encuestas);
    } catch (error) {
      console.error('Error al obtener encuestas:', error.message);
      res.status(500).json({ message: 'Error al obtener encuestas', error: error.message });
    }
  }

  // Crear una nueva encuesta
  static async createEncuesta(req, res) {
    try {
      const { title, description, options } = req.body;

      // Validar datos
      if (!title || !options || options.length === 0) {
        return res.status(400).json({ message: 'El título y las opciones son obligatorios' });
      }

      const encuesta = new Encuesta({
        title,
        description,
        options: options.map(option => ({ text: option.text || option, votes: 0 })), // Manejar opciones como texto o como objetos
        createdBy: req.userId,
      });

      await encuesta.save();
      res.status(201).json(encuesta);
    } catch (error) {
      console.error('Error al crear encuesta:', error.message);
      res.status(500).json({ message: 'Error al crear encuesta', error: error.message });
    }
  }

  // Registrar un voto en una encuesta
static async voteEncuesta(req, res) {
  try {
      const { id } = req.params;
      const { optionIndex } = req.body;

      if (optionIndex === undefined || optionIndex < 0) {
          return res.status(400).json({ message: 'El índice de la opción es obligatorio y debe ser válido' });
      }

      const encuesta = await Encuesta.findById(id);
      if (!encuesta) {
          return res.status(404).json({ message: 'Encuesta no encontrada' });
      }

      if (!encuesta.options[optionIndex]) {
          return res.status(400).json({ message: 'La opción seleccionada no es válida' });
      }

      // Incrementar el contador de votos
      encuesta.options[optionIndex].votes += 1;

      await encuesta.save();

      // Devolver la encuesta actualizada
      res.status(200).json(encuesta);
  } catch (error) {
      console.error('Error al registrar voto:', error.message);
      res.status(500).json({ message: 'Error al registrar voto', error: error.message });
  }
}


  static async updateEncuesta(req, res) {
    try {
      const { id } = req.params;
      const { title, description, options } = req.body;

      const encuesta = await Encuesta.findById(id);
      if (!encuesta) {
        return res.status(404).json({ message: 'Encuesta no encontrada' });
      }

      if (encuesta.createdBy && encuesta.createdBy.toString() !== req.userId) {
        return res.status(403).json({ message: 'No tienes permiso para actualizar esta encuesta' });
      }

      encuesta.title = title || encuesta.title;
      encuesta.description = description || encuesta.description;
      encuesta.options = options
        ? options.map(option => ({ text: option.text || option, votes: 0 }))
        : encuesta.options;

      await encuesta.save();

      // Devolver la encuesta actualizada directamente
      res.status(200).json(encuesta);
    } catch (error) {
      console.error('Error al actualizar encuesta:', error.message);
      res.status(500).json({ message: 'Error al actualizar encuesta', error: error.message });
    }
  }

  // Eliminar una encuesta
  static async deleteEncuesta(req, res) {
    try {
      const { id } = req.params;

      const encuesta = await Encuesta.findById(id);
      if (!encuesta) {
        return res.status(404).json({ message: 'Encuesta no encontrada' }); 
      }

      if (encuesta.createdBy && encuesta.createdBy.toString() !== req.userId) {
        return res.status(403).json({ message: 'El creador de la encuesta es el unico que la puede eliminar' });
      }

      await Encuesta.findByIdAndDelete(id);
      res.status(200).json({ message: 'Encuesta eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar encuesta:', error.message);
      res.status(500).json({ message: 'Error al eliminar encuesta', error: error.message });
    }
  }
}

module.exports = EncuestaController;

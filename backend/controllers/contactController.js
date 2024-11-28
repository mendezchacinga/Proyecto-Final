const Encuesta = require('../models/Encuestas'); 
const Contact = require('../models/Contact');

class ContactController {
  static async obtenerContactos(req, res) {
    try {
      const contactos = await Contact.find();
      res.status(200).json(contactos);
    } catch (error) {
      console.error('Error al obtener contactos:', error);
      res.status(500).json({ message: 'Error al obtener contactos', error: error.message });
    }
  }

  static async enviarContacto(req, res) {
    try {
      const { correo, telefono, numero, fecha, encuestaId, opcionIndex } = req.body;
      const archivo = req.file;

      // Validar datos
      if (!correo || !telefono || !numero || !fecha || !encuestaId || opcionIndex === undefined) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
      }

      // Registrar el voto en la encuesta
      const encuesta = await Encuesta.findById(encuestaId);
      if (!encuesta) {
        return res.status(404).json({ message: 'Encuesta no encontrada' });
      }

      if (!encuesta.options[opcionIndex]) {
        return res.status(400).json({ message: 'La opción seleccionada no es válida' });
      }

      encuesta.options[opcionIndex].votes += 1;
      await encuesta.save();

      // Crear los datos de contacto
      const contactoData = {
        email: correo,
        phone: telefono,
        number: numero,
        date: fecha,
        file: archivo ? archivo.path : null,
        encuestaId, // Relacionar el contacto con la encuesta
      };

      const contacto = new Contact(contactoData);
      await contacto.save();

      res.status(200).json({ success: true, encuestaActualizada: encuesta });
    } catch (error) {
      console.error('Error al enviar contacto y registrar voto:', error);
      res.status(500).json({ message: 'Error al procesar la solicitud', error: error.message });
    }
  }
}

module.exports = ContactController;

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  number: { type: Number, required: true },
  date: { type: Date, required: true },
  file: { type: String },
  encuestaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Encuesta', required: true }, // Relación con Encuesta
});

module.exports = mongoose.model('Contact', contactSchema);

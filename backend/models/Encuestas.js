const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
  },
  description: {
    type: String,
    default: 'Sin descripción',
  },
  options: [
    {
      text: {
        type: String,
        required: [true, 'El texto de la opción es obligatorio'],
      },
      votes: {
        type: Number,
        default: 0,
      },
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Encuesta', surveySchema);

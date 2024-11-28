const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'moderator', 'user'], default: 'user' },
  active: { type: Boolean, default: true },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {

  if (!this.isModified('password')) {
    console.log('Contraseña no modificada, no se rehasheará.');
    return next();
  }

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    console.error('Error al hashear la contraseña:', error);
    next(error);
  }
});



// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (password) {

  try {
    const isMatch = await bcrypt.compare(password, this.password);
    console.log('Resultado de comparación de contraseñas:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Error al comparar contraseñas:', error);
    return false;
  }
};




module.exports = mongoose.model('User', userSchema);

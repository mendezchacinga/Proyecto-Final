const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const encuestaRoutes = require('./routes/encuesta');
const contactRoutes = require('./routes/contact');
const userRoutes = require('./routes/User'); 


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
require('./config/db');

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/encuesta', encuestaRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

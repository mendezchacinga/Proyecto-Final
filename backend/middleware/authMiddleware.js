const jwt = require('jsonwebtoken');

const authMiddleware = (rolesPermitidos = []) => {
  return (req, res, next) => {
    // Obtener el token del encabezado Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // Verificar si el token está presente
    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
      // Verificar y decodificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Asignar los datos decodificados a la solicitud para su uso posterior
      req.userId = decoded.userId; // ID del usuario autenticado
      req.userRole = decoded.role; // Rol del usuario autenticado

      // Verificar si el rol del usuario está permitido
      if (rolesPermitidos.length && !rolesPermitidos.includes(decoded.role)) {
        return res.status(403).json({ message: 'Acceso denegado: no tienes los permisos necesarios.' });
      }

      // Si todo es válido, continuar con la siguiente acción
      next();
    } catch (error) {
      // Si el token es inválido o ha expirado
      res.status(403).json({ message: 'Token inválido' });
    }
  };
};

module.exports = authMiddleware;

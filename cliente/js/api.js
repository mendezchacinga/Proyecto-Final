const API_URL = 'http://localhost:3000/api';

// Obtener datos (GET)
async function obtenerDatos(ruta, opcionesAdicionales = {}) {
  try {
    const respuesta = await fetch(`${API_URL}/${ruta}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        'Content-Type': 'application/json',
        ...opcionesAdicionales.headers,
      },
      ...opcionesAdicionales,
    });

    if (!respuesta.ok) {
      const errorData = await respuesta.json();
      throw new Error(errorData.message || 'Error al obtener datos de la API');
    }

    return await respuesta.json();
  } catch (error) {
    console.error('Error en obtenerDatos:', error.message);
    return { error: error.message };
  }
}


//enviar datos
async function enviarDatos(ruta, datos, esFormData = false, opcionesAdicionales = {}) {
  try {
      const headers = esFormData
          ? { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
          : {
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
              'Content-Type': 'application/json',
          };

      const opciones = {
          method: 'POST',
          headers: { ...headers, ...opcionesAdicionales.headers },
          body: esFormData ? datos : JSON.stringify(datos),
          ...opcionesAdicionales,
      };

      const respuesta = await fetch(`${API_URL}/${ruta}`, opciones);
      console.log(respuesta)

      if (!respuesta.ok) {
          let errorMessage = `Error ${respuesta.status}: ${respuesta.statusText}`;
          try {
              const errorData = await respuesta.json();
              errorMessage = errorData.message || errorMessage;
          } catch (e) {
              // La respuesta no es JSON válido
          }
          throw new Error(errorMessage);
      }

      return await respuesta.json();
  } catch (error) {
      console.error('Error en enviarDatos:', error.message);
      return { error: error.message };
  }
}


// Actualizar datos (PUT)
async function actualizarDatos(ruta, datos, opcionesAdicionales = {}) {
  try {
    const respuesta = await fetch(`${API_URL}/${ruta}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        'Content-Type': 'application/json',
        ...opcionesAdicionales.headers,
      },
      body: JSON.stringify(datos),
      ...opcionesAdicionales,
    });

    if (!respuesta.ok) {
      const errorData = await respuesta.json();
      throw new Error(errorData.message || 'Error al actualizar datos en la API');
    }

    // Manejar respuesta sin contenido
    const contenido = await respuesta.text();
    if (contenido) {
      return JSON.parse(contenido);
    } else {
      return { success: true };
    }
  } catch (error) {
    console.error('Error en actualizarDatos:', error.message);
    return { error: error.message };
  }
}


// Eliminar datos (DELETE)
async function eliminarDatos(ruta, opcionesAdicionales = {}) {
  try {
    const respuesta = await fetch(`${API_URL}/${ruta}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        'Content-Type': 'application/json',
        ...opcionesAdicionales.headers,
      },
      ...opcionesAdicionales,
    });

    if (!respuesta.ok) {
      const errorData = await respuesta.json();
      throw new Error(errorData.message || 'Error al eliminar datos de la API');
    }

    return await respuesta.json();
  } catch (error) {
    console.error('Error en eliminarDatos:', error.message);
    return { error: error.message };
  }
}

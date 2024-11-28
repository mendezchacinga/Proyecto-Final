document.addEventListener('DOMContentLoaded', async () => {
  const listaPerfiles = document.getElementById('listaPerfiles');
  const cargando = document.getElementById('cargandoPerfiles');
  cargando.style.display = 'block';

  try {
    // Obtener todos los perfiles (usuarios)
    const perfiles = await obtenerDatos('users'); // 'users' es el endpoint del backend
    cargando.style.display = 'none';

    if (perfiles && perfiles.length > 0) {
      perfiles.forEach(perfil => agregarPerfilAlDOM(perfil));
    } else {
      listaPerfiles.innerHTML = '<tr><td colspan="5">No hay perfiles registrados.</td></tr>';
    }
  } catch (error) {
    cargando.style.display = 'none';
    listaPerfiles.innerHTML = '<tr><td colspan="5">Error al cargar los perfiles.</td></tr>';
    console.error('Error al obtener perfiles:', error);
  }
});

// Función para agregar un perfil al DOM
function agregarPerfilAlDOM(perfil) {
  const listaPerfiles = document.getElementById('listaPerfiles');
  const fila = document.createElement('tr');

  fila.innerHTML = `
    <td>${perfil._id}</td>
    <td>${perfil.username}</td>
    <td>${perfil.email}</td>
    <td>${perfil.role}</td> <!-- Mostrar el rol -->
    <td>
      <button class="btn-editar" data-id="${perfil._id}">Editar</button>
      <button class="btn-eliminar" data-id="${perfil._id}">Eliminar</button>
    </td>
  `;

  listaPerfiles.appendChild(fila);

  // Evento para editar el perfil
  fila.querySelector('.btn-editar').addEventListener('click', () => editarPerfil(perfil));

  // Evento para eliminar el perfil
  fila.querySelector('.btn-eliminar').addEventListener('click', () => eliminarPerfil(perfil._id, fila));
}

// Función para editar un perfil
function editarPerfil(perfil) {
  const nuevoNombre = prompt('Editar nombre:', perfil.username);
  const nuevoEmail = prompt('Editar email:', perfil.email);
  const nuevoRol = prompt('Editar rol (admin, moderator, user):', perfil.role);

  if (nuevoNombre && nuevoEmail && nuevoRol) {
    actualizarDatos(`users/${perfil._id}`, { username: nuevoNombre, email: nuevoEmail, role: nuevoRol })
      .then(respuesta => {
        if (respuesta.user) {
          alert('Perfil actualizado correctamente');
          location.reload();
        } else {
          alert('Error al actualizar el perfil');
        }
      })
      .catch(error => {
        console.error('Error al actualizar perfil:', error);
        alert('Error al actualizar el perfil. Intenta más tarde.');
      });
  }
}

// Función para eliminar un perfil
function eliminarPerfil(id, fila) {
  const confirmar = confirm('¿Estás seguro de que deseas eliminar este perfil? Esta acción no se puede deshacer.');

  if (confirmar) {
    eliminarDatos(`users/${id}`)
      .then(respuesta => {
        if (respuesta.message === 'Usuario eliminado correctamente') {
          alert('Perfil eliminado correctamente');
          fila.remove();
        } else {
          alert('Error al eliminar el perfil');
        }
      })
      .catch(error => {
        console.error('Error al eliminar perfil:', error);
        alert('Error al eliminar el perfil. Intenta más tarde.');
      });
  }
}

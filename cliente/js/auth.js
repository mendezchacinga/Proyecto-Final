// Selección de formularios
const formularioLogin = document.getElementById('formularioLogin');
const formularioRegistro = document.getElementById('formularioRegistro');

// Evento para el formulario de inicio de sesión
if (formularioLogin) {
    formularioLogin.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Obtener valores de los campos
        const email = document.getElementById('correoLogin').value.trim();
        const password = document.getElementById('contrasenaLogin').value.trim();
        console.log('Datos enviados al servidor:', { email, password }); // Debugging

        const cargando = document.getElementById('cargando');

        cargando.style.display = 'block';

        try {
            // Enviar datos al endpoint de login
            const respuesta = await enviarDatos('auth/login', { email, password });
            cargando.style.display = 'none';

            if (respuesta.token) {
                alert('Inicio de sesión exitoso');
                localStorage.setItem('token', respuesta.token); // Guardar token en localStorage
                window.location.href = 'dashboard.html'; // Redirigir al dashboard
            } else {
                alert('Credenciales incorrectas, intenta de nuevo.');
            }
        } catch (error) {
            cargando.style.display = 'none';
            alert('Error al intentar iniciar sesión. Intenta más tarde.');
            console.error('Error en el login:', error);
        }
    });
}

// Evento para el formulario de registro
formularioRegistro &&
  formularioRegistro.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('usuarioRegistro').value.trim();
    const email = document.getElementById('correoRegistro').value.trim();
    const password = document.getElementById('contrasenaRegistro').value.trim();
    const role = document.getElementById('rolRegistro').value.trim();
    const cargandoRegistro = document.getElementById('cargandoRegistro');

    cargandoRegistro.style.display = 'block';

    try {
      const respuesta = await enviarDatos('auth/register', { username, email, password, role });
      cargandoRegistro.style.display = 'none';

      // Aquí está la corrección. Si el mensaje es "Usuario registrado exitosamente"
      if (respuesta && respuesta.message === "Usuario registrado exitosamente") {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        window.location.href = 'index.html'; // Redirigir a la página de login
      } else if (respuesta && respuesta.message) {
        alert(`Error: ${respuesta.message}`); // Si hay un error en el mensaje
      } else {
        alert('Error desconocido al registrar usuario.');
      }
    } catch (error) {
      cargandoRegistro.style.display = 'none';
      alert('Error al intentar registrar usuario. Intenta más tarde.');
      console.error('Error en el registro:', error);
    }
  });




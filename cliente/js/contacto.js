document.getElementById('formularioContacto').addEventListener('submit', async (e) => {
    e.preventDefault();

    const contactoDatos = {
        correo: document.getElementById('contactoCorreo').value,
        telefono: document.getElementById('contactoTelefono').value,
        numero: document.getElementById('contactoNumero').value,
        fecha: document.getElementById('contactoFecha').value,
        archivo: document.getElementById('contactoArchivo').files[0],
    };

    // Crear un objeto FormData para enviar datos con archivo
    const formData = new FormData();
    formData.append('correo', contactoDatos.correo);
    formData.append('telefono', contactoDatos.telefono);
    formData.append('numero', contactoDatos.numero);
    formData.append('fecha', contactoDatos.fecha);
    formData.append('archivo', contactoDatos.archivo);

    document.getElementById('cargandoContacto').style.display = 'block';

    try {
        // Enviar los datos del formulario a través de la función enviarDatos
        const respuesta = await enviarDatos('contacto/enviar', formData, true);
        document.getElementById('cargandoContacto').style.display = 'none';

        if (respuesta && respuesta.success) {
            alert('Formulario enviado exitosamente. Gracias por contactarnos.');
            document.getElementById('formularioContacto').reset(); // Limpiar el formulario
        } else {
            alert('Error al enviar el formulario. Intenta de nuevo.');
        }
    } catch (error) {
        document.getElementById('cargandoContacto').style.display = 'none';
        alert('Hubo un problema al enviar el formulario. Intenta más tarde.');
        console.error('Error en el envío de contacto:', error);
    }
});

// Variables globales para almacenar la encuesta y opción seleccionadas
let encuestaSeleccionadaId = null;
let opcionSeleccionadaIndex = null;

// Evento que se ejecuta cuando el DOM ha cargado completamente
document.addEventListener('DOMContentLoaded', async () => {
    const encuestasContainer = document.getElementById('listaEncuestas');
    const cargando = document.getElementById('cargandoEncuestas');
    cargando.style.display = 'block';

    try {
        // Obtener todas las encuestas desde el servidor
        const encuestas = await obtenerDatos('encuesta');
        cargando.style.display = 'none';

        if (encuestas && encuestas.length > 0) {
            // Agregar cada encuesta al DOM
            encuestas.forEach(encuesta => {
                agregarEncuestaAlDOM(encuesta);
            });
        } else {
            encuestasContainer.innerHTML = '<p>No hay encuestas disponibles.</p>';
        }
    } catch (error) {
        cargando.style.display = 'none';
        encuestasContainer.innerHTML = '<p>Error al cargar las encuestas. Intenta más tarde.</p>';
        console.error('Error al obtener encuestas:', error);
    }
});

// Función para crear o actualizar una encuesta
document.getElementById('formularioCrearEncuesta').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('tituloEncuesta').value;
    const description = document.getElementById('descripcionEncuesta').value;
    const options = Array.from(document.querySelectorAll('.opcionInput'))
        .map(input => input.value.trim())
        .filter(option => option !== '');

    const cargandoCrear = document.getElementById('cargandoCrearEncuesta');
    cargandoCrear.style.display = 'block';
    const idEncuesta = e.target.getAttribute('data-id');

    try {
        const endpoint = idEncuesta ? `encuesta/${idEncuesta}` : 'encuesta';
        const datos = { title, description, options: options.map(text => ({ text })) };
        const respuesta = idEncuesta
            ? await actualizarDatos(endpoint, datos)
            : await enviarDatos(endpoint, datos);

        cargandoCrear.style.display = 'none';

        if (respuesta && respuesta._id) {
            alert(idEncuesta ? 'Encuesta actualizada exitosamente' : 'Encuesta creada exitosamente');

            // Actualizar el DOM
            if (idEncuesta) {
                const encuestaElement = document.querySelector(`.encuesta[data-id="${idEncuesta}"]`);
                if (encuestaElement) {
                    encuestaElement.remove();
                }
            }
            agregarEncuestaAlDOM(respuesta);

            // Limpiar formulario
            document.getElementById('formularioCrearEncuesta').reset();
            document.getElementById('opcionesContainer').innerHTML = '<input type="text" class="opcionInput" placeholder="Opción 1" required>';
            e.target.removeAttribute('data-id');
        } else {
            throw new Error('La respuesta del servidor no es válida.');
        }
    } catch (error) {
        cargandoCrear.style.display = 'none';
        alert(`${idEncuesta ? 'Debes ser admin y el creador de la encuesta para realizar modificaciones' : 'Solo los administradores pueden crear encuestas.'}`);
        console.error('Error al guardar encuesta:', error);
    }
});

// Agregar opción dinámica al formulario de creación de encuesta
document.getElementById('agregarOpcion').addEventListener('click', () => {
    const opcionesContainer = document.getElementById('opcionesContainer');
    const optionInput = document.createElement('input');
    optionInput.type = 'text';
    optionInput.className = 'opcionInput';
    optionInput.placeholder = `Opción ${opcionesContainer.children.length + 1}`;
    opcionesContainer.appendChild(optionInput);
});

// Función para agregar una encuesta al DOM
function agregarEncuestaAlDOM(encuesta) {
    const encuestasContainer = document.getElementById('listaEncuestas');
    const encuestaElement = document.createElement('div');
    encuestaElement.className = 'encuesta';

    // Asignar el atributo data-id al elemento principal de la encuesta
    encuestaElement.setAttribute('data-id', encuesta._id);

    encuestaElement.innerHTML = `
        <h3>${encuesta.title}</h3>
        <p>${encuesta.description || 'Sin descripción'}</p>
        <div class="opciones">
            ${encuesta.options.map((option, index) => `
                <button class="btn-opcion" data-index="${index}">
                    ${option.text}
                </button>
            `).join('')}
        </div>
        <div class="resultados">
            <p>Total de votos: ${encuesta.options.reduce((sum, opt) => sum + opt.votes, 0)}</p>
            ${encuesta.options.map(option => `
                <p>${option.text}: ${option.votes} votos (${encuesta.options.reduce((sum, opt) => sum + opt.votes, 0) > 0
                    ? ((option.votes / encuesta.options.reduce((sum, opt) => sum + opt.votes, 0)) * 100).toFixed(1)
                    : 0
                }%)</p>
            `).join('')}
        </div>
        <button class="btn-editar" data-id="${encuesta._id}">Editar Encuesta</button>
        <button class="btn-eliminar" data-id="${encuesta._id}">Eliminar Encuesta</button>
    `;

    encuestasContainer.appendChild(encuestaElement);

    // Evento para votar en una opción
    const botonesOpcion = encuestaElement.querySelectorAll('.btn-opcion');
    botonesOpcion.forEach(boton => {
        boton.addEventListener('click', () => {
            const opcionIndex = boton.getAttribute('data-index');
            encuestaSeleccionadaId = encuesta._id;
            opcionSeleccionadaIndex = opcionIndex;
            mostrarModalContacto();
        });
    });

    // Evento para el botón eliminar
    encuestaElement.querySelector('.btn-eliminar').addEventListener('click', async () => {
        const confirmar = confirm('¿Estás seguro de que deseas eliminar esta encuesta? Esta acción no se puede deshacer.');
        if (confirmar) {
            const cargando = document.getElementById('cargandoEncuestas');
            cargando.style.display = 'block';
            try {
                const respuesta = await eliminarDatos(`encuesta/${encuesta._id}`);
                cargando.style.display = 'none';

                if (respuesta && respuesta.message === 'Encuesta eliminada exitosamente') {
                    alert('Encuesta eliminada correctamente');
                    encuestaElement.remove();
                } else {                  
                    alert(respuesta.error);
                }
            } catch (error) {
                cargando.style.display = 'none';
                alert('Error al intentar eliminar la encuesta. Revisa tu conexión.');
                console.error('Error al eliminar encuesta:', error);
            }
        }
    });

    // Evento para el botón editar
    encuestaElement.querySelector('.btn-editar').addEventListener('click', () => {
        document.getElementById('tituloEncuesta').value = encuesta.title;
        document.getElementById('descripcionEncuesta').value = encuesta.description || '';
        const opcionesContainer = document.getElementById('opcionesContainer');
        opcionesContainer.innerHTML = '';
        encuesta.options.forEach((option, index) => {
            const optionInput = document.createElement('input');
            optionInput.type = 'text';
            optionInput.className = 'opcionInput';
            optionInput.value = option.text;
            optionInput.placeholder = `Opción ${index + 1}`;
            opcionesContainer.appendChild(optionInput);
        });
        document.getElementById('formularioCrearEncuesta').setAttribute('data-id', encuesta._id);
    });
}

// Funciones para mostrar y cerrar el modal de contacto
function mostrarModalContacto() {
    const modal = document.getElementById('modalContacto');
    modal.style.display = 'block';
}

function cerrarModalContacto() {
    const modal = document.getElementById('modalContacto');
    modal.style.display = 'none';
    document.getElementById('formularioContacto').reset();
}

// Evento para cerrar el modal al hacer clic en la 'X'
document.getElementById('cerrarModalContacto').addEventListener('click', cerrarModalContacto);

// Evento para cerrar el modal al hacer clic fuera del contenido
window.addEventListener('click', (event) => {
    const modal = document.getElementById('modalContacto');
    if (event.target === modal) {
        cerrarModalContacto();
    }
});

// Evento para enviar el formulario de contacto y registrar el voto
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
    formData.append('encuestaId', encuestaSeleccionadaId);
    formData.append('opcionIndex', opcionSeleccionadaIndex);

    document.getElementById('cargandoContacto').style.display = 'block';

    try {
        // Enviar los datos del formulario y el voto al servidor
        const respuesta = await enviarDatos('contact/enviar', formData, true);
        document.getElementById('cargandoContacto').style.display = 'none';

        if (respuesta && respuesta.success) {
            alert('Formulario enviado y voto registrado exitosamente. Gracias por contactarnos.');
            cerrarModalContacto();

            // Actualizar la encuesta en el DOM con los nuevos datos
            const encuestaActualizada = respuesta.encuestaActualizada;
            const encuestaElement = document.querySelector(`.encuesta[data-id="${encuestaSeleccionadaId}"]`);
            if (encuestaElement) {
                encuestaElement.remove();
            }
            agregarEncuestaAlDOM(encuestaActualizada);
        } else {
            alert('Error al enviar el formulario y registrar el voto. Intenta de nuevo.');
        }
    } catch (error) {
        document.getElementById('cargandoContacto').style.display = 'none';
        alert('Hubo un problema al enviar el formulario. Intenta más tarde.');
        console.error('Error en el envío de contacto y voto:', error);
    }
});

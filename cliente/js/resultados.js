document.addEventListener('DOMContentLoaded', async () => {
  const totalEncuestas = document.getElementById('totalEncuestas');
  const totalVotos = document.getElementById('totalVotos');
  const listaResultados = document.getElementById('listaResultados');

  try {
      const encuestas = await obtenerDatos('encuesta');
      const contactos = await obtenerDatos('contact/contactos');

      // Resumen general
      totalEncuestas.textContent = encuestas.length;
      totalVotos.textContent = encuestas.reduce((sum, encuesta) => {
          return sum + encuesta.options.reduce((optSum, opt) => optSum + opt.votes, 0);
      }, 0);

      // Listado de encuestas con contactos
      encuestas.forEach(encuesta => {
          const card = document.createElement('div');
          card.className = 'resultados-card';

          const totalVotosEncuesta = encuesta.options.reduce((sum, opt) => sum + opt.votes, 0);

          // Filtrar contactos relacionados con esta encuesta
          const contactosRelacionados = contactos.filter(contacto => contacto.encuestaId === encuesta._id);

          card.innerHTML = `
              <h3>${encuesta.title}</h3>
              <p>Total de Votos: ${totalVotosEncuesta}</p>
              <table>
                <thead>
                  <tr>
                    <th>Opción</th>
                    <th>Votos</th>
                    <th>Porcentaje</th>
                  </tr>
                </thead>
                <tbody>
                  ${encuesta.options.map(option => `
                    <tr>
                      <td>${option.text}</td>
                      <td>${option.votes}</td>
                      <td>${totalVotosEncuesta > 0 ? ((option.votes / totalVotosEncuesta) * 100).toFixed(1) : 0}%</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <h4>Contactos Relacionados:</h4>
              <table>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Fecha</th>
                    <th>Archivo</th>
                  </tr>
                </thead>
                <tbody>
                  ${contactosRelacionados.map(contacto => `
                    <tr>
                      <td>${contacto.email}</td>
                      <td>${contacto.phone}</td>
                      <td>${new Date(contacto.date).toLocaleDateString()}</td>
                      <td>${contacto.file ? `<a href="/${contacto.file}" target="_blank">Ver archivo</a>` : 'No disponible'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
          `;

          listaResultados.appendChild(card);
      });
  } catch (error) {
      console.error('Error al obtener los resultados:', error);
      listaResultados.innerHTML = '<p>Error al cargar los resultados. Intenta más tarde.</p>';
  }
});

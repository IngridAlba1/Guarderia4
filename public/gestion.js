document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('gestionForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const id = document.getElementById('registro-id').value;
        if (id) {
            actualizarRegistro(id);
        } else {
            buscarPorTelefono();
        }
    });
});

function buscarPorTelefono() {
    const telefono = document.getElementById('telefono-gestion').value;
    fetch(`/api/datos/telefono/${telefono}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se encontraron datos con ese número de teléfono');
            }
            return response.json();
        })
        .then(datos => {
            const datosTbody = document.getElementById('datos-tbody');
            datosTbody.innerHTML = '';
            if (datos.length > 0) {
                datos.forEach(dato => {
                    const fechaInicio = new Date(dato.fechaInicio);
                    const fechaFin = new Date(dato.fechaFin);

                    // Corregir la fecha sumando la diferencia horaria manualmente para mostrar la fecha correcta en Colombia
                    const offset = fechaInicio.getTimezoneOffset() * 60000;
                    const fechaInicioCorregida = new Date(fechaInicio.getTime() + offset);
                    const fechaFinCorregida = new Date(fechaFin.getTime() + offset);

                    const fechaInicioStr = fechaInicioCorregida.toISOString().split('T')[0];
                    const fechaFinStr = fechaFinCorregida.toISOString().split('T')[0];

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${dato._id}</td>
                        <td>${dato.nombresApellidos}</td>
                        <td>${dato.telefono}</td>
                        <td>${dato.correo}</td>
                        <td>${dato.ciudad}</td>
                        <td>${dato.tipoMascota}</td>
                        <td>${dato.nombrePeludito}</td>
                        <td>${fechaInicioStr}</td>
                        <td>${fechaFinStr}</td>
                        <td>
                            <button class="btn btn-primary btn-sm" onclick="editarRegistro('${dato._id}')">Actualizar</button>
                            <button class="btn btn-danger btn-sm" onclick="eliminarRegistro('${dato._id}')">Eliminar</button>
                        </td>
                    `;
                    datosTbody.appendChild(row);
                });
                mostrarSeccion('tabla-datos');
            } else {
                alert('No se encontraron datos con ese número de teléfono');
            }
        })
        .catch(err => {
            console.error('Error al consultar datos:', err);
            alert('No se encontraron datos con ese número de teléfono');
        });
}

function editarRegistro(id) {
    fetch(`/api/datos/${id}`)
        .then(response => response.json())
        .then(dato => {
            document.getElementById('registro-id').value = id;
            document.getElementById('telefono-gestion').value = dato.telefono;
            document.getElementById('nombres-apellidos-gestion').value = dato.nombresApellidos;
            document.getElementById('correo-gestion').value = dato.correo;
            document.getElementById('ciudad-gestion').value = dato.ciudad;
            document.getElementById('tipo-mascota-gestion').value = dato.tipoMascota;
            document.getElementById('nombre-peludito-gestion').value = dato.nombrePeludito;

            const fechaInicio = new Date(dato.fechaInicio);
            const fechaFin = new Date(dato.fechaFin);

            // Corregir la fecha sumando la diferencia horaria manualmente para mostrar la fecha correcta en Colombia
            const offset = fechaInicio.getTimezoneOffset() * 60000;
            const fechaInicioCorregida = new Date(fechaInicio.getTime() + offset);
            const fechaFinCorregida = new Date(fechaFin.getTime() + offset);

            document.getElementById('fecha-inicio-gestion').value = fechaInicioCorregida.toISOString().split('T')[0];
            document.getElementById('fecha-fin-gestion').value = fechaFinCorregida.toISOString().split('T')[0];
            
            document.getElementById('datosAdicionales').style.display = 'block';
            mostrarSeccion('gestion-datos');
        })
        .catch(err => console.error('Error al obtener datos:', err));
}

function actualizarRegistro(id) {
    const datos = {
        nombresApellidos: document.getElementById('nombres-apellidos-gestion').value,
        telefono: document.getElementById('telefono-gestion').value,
        correo: document.getElementById('correo-gestion').value,
        ciudad: document.getElementById('ciudad-gestion').value,
        tipoMascota: document.getElementById('tipo-mascota-gestion').value,
        nombrePeludito: document.getElementById('nombre-peludito-gestion').value,
        fechaInicio: document.getElementById('fecha-inicio-gestion').value,
        fechaFin: document.getElementById('fecha-fin-gestion').value,
    };

    fetch(`/api/datos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    }).then(response => {
        if (response.ok) {
            alert('Dato actualizado');
            buscarPorTelefono();
        } else {
            alert('Error al actualizar el dato');
        }
    });
}

function eliminarRegistro(id) {
    if (confirm('¿Está seguro de que desea eliminar este registro?')) {
        fetch(`/api/datos/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Registro eliminado correctamente');
                buscarPorTelefono();
            } else {
                alert('Error al eliminar el registro');
            }
        })
        .catch(err => console.error('Error al eliminar el registro:', err));
    }
}

function mostrarSeccion(seccionId) {
    const secciones = document.querySelectorAll('.seccion');
    secciones.forEach(seccion => {
        seccion.style.display = 'none';
    });
    document.getElementById(seccionId).style.display = 'block';
}

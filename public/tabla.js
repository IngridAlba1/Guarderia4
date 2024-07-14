document.addEventListener('DOMContentLoaded', function() {
    // Ya no necesitamos cargar los datos de la tabla aquí, solo cuando se hace clic en "Revisar Tabla"
    // cargarDatosTabla();
});

function cargarDatosTabla() {
    fetch('/api/datos')
        .then(response => response.json())
        .then(datos => {
            const datosTbody = document.getElementById('datos-tbody');
            datosTbody.innerHTML = '';
            datos.forEach(dato => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${dato._id}</td>
                    <td>${dato.nombresApellidos}</td>
                    <td>${dato.telefono}</td>
                    <td>${dato.correo}</td>
                    <td>${dato.ciudad}</td>
                    <td>${dato.tipoMascota}</td>
                    <td>${dato.nombrePeludito}</td>
                    <td>${new Date(dato.fechaInicio).toLocaleDateString()}</td>
                    <td>${new Date(dato.fechaFin).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="eliminarRegistro('${dato._id}')">Eliminar</button>
                    </td>
                `;
                datosTbody.appendChild(row);
            });
        })
        .catch(err => console.error('Error al obtener datos:', err));
}

function editarRegistro(id) {
    mostrarSeccion('gestion-datos');
    document.getElementById('accion').value = 'actualizar';

    fetch(`/api/datos/${id}`)
        .then(response => response.json())
        .then(dato => {
            document.getElementById('telefono-gestion').value = dato.telefono;
            document.getElementById('nombres-apellidos-gestion').value = dato.nombresApellidos;
            document.getElementById('correo-gestion').value = dato.correo;
            document.getElementById('ciudad-gestion').value = dato.ciudad;
            document.getElementById('tipo-mascota-gestion').value = dato.tipoMascota;
            document.getElementById('nombre-peludito-gestion').value = dato.nombrePeludito;
            document.getElementById('fecha-inicio-gestion').value = dato.fechaInicio.split('T')[0];
            document.getElementById('fecha-fin-gestion').value = dato.fechaFin.split('T')[0];
            document.getElementById('datosAdicionales').style.display = 'block';
        })
        .catch(err => console.error('Error al obtener datos:', err));
}

function eliminarRegistro(id) {
    const confirmacion = confirm('¿Está seguro de que desea eliminar este registro?');
    if (confirmacion) {
        fetch(`/api/datos/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Registro eliminado correctamente');
                cargarDatosTabla();
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

// JavaScript para manejar el envío del formulario y validación de Bootstrap
(() => {
    'use strict';

    window.addEventListener('load', () => {
        const forms = document.getElementsByClassName('needs-validation');
        Array.prototype.filter.call(forms, (form) => {
            form.addEventListener('submit', (event) => {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();

const formularioDatos = document.getElementById('formularioDatos');

formularioDatos.addEventListener('submit', async function(event) {
    event.preventDefault(); // Evitar el envío del formulario

    if (formularioDatos.checkValidity() === false) {
        event.stopPropagation();
        formularioDatos.classList.add('was-validated');
        return;
    }

    // Obtener los valores del formulario
    const nombresApellidos = document.getElementById('nombres-apellidos').value;
    const telefono = document.getElementById('telefono').value;
    const correo = document.getElementById('correo').value;
    const ciudad = document.getElementById('ciudad').value;
    const tipoMascota = document.getElementById('tipo-mascota').value;
    const nombrePeludito = document.getElementById('nombre-peludito').value;
    const fechaInicio = document.getElementById('fecha-inicio').value;
    const fechaFin = document.getElementById('fecha-fin').value;

    // Verificar que la fecha de fin sea mayor o igual que la fecha de inicio
    if (new Date(fechaFin) < new Date(fechaInicio)) {
        alert('La fecha de fin debe ser igual o posterior a la fecha de inicio.');
        document.getElementById('fecha-fin').classList.add('is-invalid');
        return;
    } else {
        document.getElementById('fecha-fin').classList.remove('is-invalid');
    }

    // Mostrar los valores en la consola del navegador
    console.log('Nombres y Apellidos:', nombresApellidos);
    console.log('Teléfono:', telefono);
    console.log('Correo electrónico:', correo);
    console.log('Ciudad:', ciudad);
    console.log('Tipo de mascota:', tipoMascota);
    console.log('Nombre de Tu peludito:', nombrePeludito);
    console.log('Fecha de Inicio de Servicio:', fechaInicio);
    console.log('Fecha de Fin de Servicio:', fechaFin);

    // Enviar datos al servidor usando fetch
    try {
        const response = await fetch('/api/datos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombresApellidos,
                telefono,
                correo,
                ciudad,
                tipoMascota,
                nombrePeludito,
                fechaInicio,
                fechaFin
            }),
        });
        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        alert('Datos enviados correctamente');
        formularioDatos.reset();
        formularioDatos.classList.remove('was-validated');
    } catch (error) {
        console.error('Error al enviar los datos:', error);
        alert('Hubo un error al enviar los datos');
    }
});

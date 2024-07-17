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

    const fechaInicio = new Date(document.getElementById('fecha-inicio').value + 'T00:00:00');
    const fechaFin = new Date(document.getElementById('fecha-fin').value + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to midnight to compare only the date part

    if (fechaInicio < today) {
        document.getElementById('fecha-inicio').setCustomValidity('La fecha de inicio no puede ser inferior al día de hoy.');
        document.getElementById('fecha-inicio').reportValidity();
        return;
    } else {
        document.getElementById('fecha-inicio').setCustomValidity('');
    }

    if (fechaFin < fechaInicio) {
        document.getElementById('fecha-fin').setCustomValidity('La fecha de fin debe ser igual o posterior a la fecha de inicio.');
        document.getElementById('fecha-fin').reportValidity();
        return;
    } else {
        document.getElementById('fecha-fin').setCustomValidity('');
    }

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
    const fechaInicioStr = fechaInicio.toISOString();
    const fechaFinStr = fechaFin.toISOString();

    // Mostrar los valores en la consola del navegador
    console.log('Nombres y Apellidos:', nombresApellidos);
    console.log('Teléfono:', telefono);
    console.log('Correo electrónico:', correo);
    console.log('Ciudad:', ciudad);
    console.log('Tipo de mascota:', tipoMascota);
    console.log('Nombre de Tu peludito:', nombrePeludito);
    console.log('Fecha de Inicio de Servicio:', fechaInicioStr);
    console.log('Fecha de Fin de Servicio:', fechaFinStr);

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
                fechaInicio: fechaInicioStr,
                fechaFin: fechaFinStr
            }),
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Respuesta del servidor:', data);
            alert('Datos enviados correctamente');
            formularioDatos.reset();
            formularioDatos.classList.remove('was-validated');
            window.location.href = 'actualizar.html'; // Redirigir a la página de actualización
        } else {
            throw new Error('Error en la respuesta del servidor');
        }
    } catch (error) {
        console.error('Error al enviar los datos:', error);
        alert('Hubo un error al enviar los datos');
    }
});

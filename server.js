const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose'); // BD Mongoose
const app = express();
const port = 3002; // Puerto en el que escuchará el servidor

// Configuración para analizar datos JSON y urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a MongoDB usando Mongoose 
mongoose.connect('mongodb://localhost:27017/guarderiaDB')
  .then(() => {
    console.log('Conectado a la base de datos MongoDB');
  })
  .catch((err) => {
    console.error('Error de conexión a MongoDB:', err);
  });

// Definir esquema y modelo de datos
const datosSchema = new mongoose.Schema({
  nombresApellidos: String,
  telefono: String,
  correo: String,
  ciudad: String,
  tipoMascota: String,
  nombrePeludito: String,
  fechaInicio: Date,
  fechaFin: Date
});
const Datos = mongoose.model('Datos', datosSchema);

// Middleware para servir archivos estáticos (HTML, CSS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para manejar los datos del formulario
app.post('/enviar-datos', (req, res) => {
    console.log('Datos recibidos del formulario:',req.body);
    
  const { nombresApellidos, telefono, correo, ciudad, tipoMascota, nombrePeludito, fechaInicio, fechaFin } = req.body;

  // Crear un nuevo documento de tipo Datos
  const newData = new Datos({
    nombresApellidos,
    telefono,
    correo,
    ciudad,
    tipoMascota,
    nombrePeludito,
    fechaInicio,
    fechaFin
  });

  // Guardar los datos en MongoDB
  newData.save()
    .then(() => {
      console.log('Datos guardados en MongoDB');
      res.send('Datos guardados en MongoDB');
    })
    .catch(err => {
      console.error('Error al guardar datos en MongoDB:', err);
      res.status(500).send('Error interno al guardar los datos');
    });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

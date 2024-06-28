// models/datos.js

const mongoose = require('mongoose');

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

module.exports = mongoose.model('Datos', datosSchema);

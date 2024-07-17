const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = 3002;

// Middleware para analizar datos JSON y URL codificada
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

// Endpoint para obtener todos los datos (GET)
app.get('/api/datos', (req, res) => {
  Datos.find()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.error('Error al obtener datos:', err);
      res.status(500).send('Error interno al obtener los datos');
    });
});

// Endpoint para obtener un dato por ID (GET)
app.get('/api/datos/:id', (req, res) => {
  const id = req.params.id;
  Datos.findById(id)
    .then(data => {
      if (!data) {
        res.status(404).send('Dato no encontrado');
      } else {
        res.json(data);
      }
    })
    .catch(err => {
      console.error('Error al obtener el dato por ID:', err);
      res.status(500).send('Error interno al obtener el dato');
    });
});

// Endpoint para obtener datos por número de teléfono (GET)
app.get('/api/datos/telefono/:telefono', (req, res) => {
  const telefono = req.params.telefono;
  Datos.find({ telefono })
    .then(data => {
      if (data.length === 0) {
        res.status(404).send('No se encontraron datos con ese número de teléfono');
      } else {
        res.json(data);
      }
    })
    .catch(err => {
      console.error('Error al obtener datos por teléfono:', err);
      res.status(500).send('Error interno al obtener los datos');
    });
});

// Endpoint para crear un nuevo dato (POST)
app.post('/api/datos', (req, res) => {
  console.log('Datos recibidos del formulario:', req.body);
  
  const { nombresApellidos, telefono, correo, ciudad, tipoMascota, nombrePeludito, fechaInicio, fechaFin } = req.body;

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

  newData.save()
    .then(() => {
      console.log('Datos guardados en MongoDB');
      res.json(newData);
    })
    .catch(err => {
      console.error('Error al guardar datos en MongoDB:', err);
      res.status(500).json({ message: 'Error interno al guardar los datos' });
    });
});

// Endpoint para actualizar un dato por ID (PUT)
app.put('/api/datos/:id', (req, res) => {
  const id = req.params.id;
  const { nombresApellidos, telefono, correo, ciudad, tipoMascota, nombrePeludito, fechaInicio, fechaFin } = req.body;

  Datos.findByIdAndUpdate(id, {
    nombresApellidos,
    telefono,
    correo,
    ciudad,
    tipoMascota,
    nombrePeludito,
    fechaInicio,
    fechaFin
  }, { new: true })
    .then(data => {
      if (!data) {
        res.status(404).send('Dato no encontrado para actualizar');
      } else {
        console.log('Dato actualizado:', data);
        res.send('Dato actualizado correctamente');
      }
    })
    .catch(err => {
      console.error('Error al actualizar el dato:', err);
      res.status(500).send('Error interno al actualizar el dato');
    });
});

// Endpoint para eliminar un dato por ID (DELETE)
app.delete('/api/datos/:id', (req, res) => {
  const id = req.params.id;
  
  Datos.findByIdAndDelete(id)
    .then(data => {
      if (!data) {
        res.status(404).send('Dato no encontrado para eliminar');
      } else {
        console.log('Dato eliminado:', data);
        res.send('Dato eliminado correctamente');
      }
    })
    .catch(err => {
      console.error('Error al eliminar el dato:', err);
      res.status(500).send('Error interno al eliminar el dato');
    });
});

// Manejo de la ruta raíz del servidor
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejo de la ruta para actualizar.html
app.get('/actualizar', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'actualizar.html'));
});

// Manejo de errores para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).send('Ruta no encontrada');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

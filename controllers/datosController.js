// controllers/datosController.js

const Datos = require('../models/datos');

exports.getAllDatos = (req, res) => {
  Datos.find()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.error('Error al obtener los datos:', err);
      res.status(500).send('Error interno al obtener los datos');
    });
};

exports.getDatosById = (req, res) => {
  const id = req.params.id;
  Datos.findById(id)
    .then((data) => {
      if (!data) {
        return res.status(404).send('Dato no encontrado');
      }
      res.json(data);
    })
    .catch((err) => {
      console.error('Error al obtener el dato por ID:', err);
      res.status(500).send('Error interno al obtener el dato por ID');
    });
};

exports.createDatos = (req, res) => {
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
      res.send('Datos guardados en MongoDB');
    })
    .catch(err => {
      console.error('Error al guardar datos en MongoDB:', err);
      res.status(500).send('Error interno al guardar los datos');
    });
};

exports.updateDatos = (req, res) => {
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
    .then((data) => {
      if (!data) {
        return res.status(404).send('Dato no encontrado para actualizar');
      }
      console.log('Datos actualizados:', data);
      res.send('Datos actualizados en MongoDB');
    })
    .catch(err => {
      console.error('Error al actualizar datos en MongoDB:', err);
      res.status(500).send('Error interno al actualizar los datos');
    });
};

exports.deleteDatos = (req, res) => {
  const id = req.params.id;

  Datos.findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        return res.status(404).send('Dato no encontrado para eliminar');
      }
      console.log('Dato eliminado:', data);
      res.send('Dato eliminado de MongoDB');
    })
    .catch(err => {
      console.error('Error al eliminar dato en MongoDB:', err);
      res.status(500).send('Error interno al eliminar el dato');
    });
};

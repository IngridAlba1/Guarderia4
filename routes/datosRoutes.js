// routes/datosRoutes.js

const express = require('express');
const router = express.Router();
const datosController = require('../controllers/datosController');

router.get('/datos', datosController.getAllDatos);
router.get('/datos/:id', datosController.getDatosById);
router.post('/datos', datosController.createDatos);
router.put('/datos/:id', datosController.updateDatos);
router.delete('/datos/:id', datosController.deleteDatos);

module.exports = router;

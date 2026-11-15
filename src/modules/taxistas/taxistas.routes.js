'use strict';
const router = require('express').Router();
const controller = require('./taxistas.controller');
const { verificarToken, verificarRol } = require('../../middlewares/auth');

// Solo los pasajeros pueden buscar taxis cercanos
router.get('/cercanos', verificarToken, verificarRol(['pasajero']), controller.obtenerCercanos);

module.exports = router;
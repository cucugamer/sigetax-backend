'use strict';
const router = require('express').Router();
const controller = require('./telemetria.controller');
const { verificarToken, verificarRol } = require('../../middlewares/auth');

router.post('/ubicacion', verificarToken, verificarRol(['taxista']), controller.enviarUbicacion);
module.exports = router;
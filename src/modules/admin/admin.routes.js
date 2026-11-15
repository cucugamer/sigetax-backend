'use strict';
const router = require('express').Router();
const controller = require('./admin.controller');
const { verificarToken, verificarRol } = require('../../middlewares/auth');

// Todas las rutas requieren ser Administrador
router.use(verificarToken, verificarRol(['administrador']));

router.get('/alertas', controller.getAlertas);
router.get('/taxistas', controller.getTaxistas);
router.put('/tarifas/:id', controller.putTarifa);

module.exports = router;
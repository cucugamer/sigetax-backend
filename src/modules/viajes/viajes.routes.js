'use strict';
const router = require('express').Router();
const controller = require('./viajes.controller');
const { verificarToken, verificarRol } = require('../../middlewares/auth');

// Ruta para pasajeros
router.post('/solicitar', verificarToken, verificarRol(['pasajero']), controller.solicitar);
/**
 * @openapi
 * /viajes/solicitar:
 *   post:
 *     tags: [Viajes]
 *     summary: Solicitar un nuevo viaje
 *     description: Crea un viaje en estado "solicitado" y genera un token de rastreo.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               origen:
 *                 type: object
 *                 properties:
 *                   lat: { type: number, example: 19.2433 }
 *                   lng: { type: number, example: -103.7250 }
 *               destino:
 *                 type: object
 *                 properties:
 *                   lat: { type: number, example: 19.2644 }
 *                   lng: { type: number, example: -103.7372 }
 *     responses:
 *       201:
 *         description: Viaje solicitado exitosamente
 */

// Ruta para taxistas (¡La que nos falta!)
router.put('/:id/aceptar', verificarToken, verificarRol(['taxista']), controller.aceptar);
router.get('/pendiente', verificarToken, verificarRol(['taxista']), controller.obtenerPendiente);
router.get('/:id/estado', verificarToken, verificarRol(['pasajero']), controller.obtenerEstado);


module.exports = router;
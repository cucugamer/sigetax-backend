'use strict';
const router = require('express').Router();
const controller = require('./seguridad.controller');
const { verificarToken, verificarRol } = require('../../middlewares/auth'); // 👈 Aquí debe decir SOLO ./seguridad.controller

// Ruta PÚBLICA (sin verificarToken)
router.get('/rastreo/:token', controller.rastreoPublico);
router.post('/panico', verificarToken, verificarRol(['pasajero']), controller.botonPanico);
/**
 * @openapi
 * /seguridad/panico:
 *   post:
 *     tags: [Seguridad]
 *     summary: Activar Botón de Pánico
 *     description: Registra una alerta de seguridad con la ubicación actual del pasajero.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_viaje: { type: integer, example: 1 }
 *               lat: { type: number, example: 19.2500 }
 *               lng: { type: number, example: -103.7300 }
 *     responses:
 *       201:
 *         description: Alerta enviada exitosamente
 */

module.exports = router;
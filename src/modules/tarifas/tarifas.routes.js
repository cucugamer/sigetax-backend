'use strict';
const router = require('express').Router();
const controller = require('./tarifas.controller');
const { verificarToken } = require('../../middlewares/auth.js');

// Ruta protegida: Requiere JWT válido
router.post('/calcular', verificarToken, controller.calcular);
/**
 * @openapi
 * /tarifas/calcular:
 *   post:
 *     tags: [Tarifas]
 *     summary: Calcular tarifa estimada
 *     description: Calcula el costo basado en coordenadas de origen y destino usando Google Maps o Haversine.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               origen_lat: { type: number, example: 19.2433 }
 *               origen_lng: { type: number, example: -103.7250 }
 *               destino_lat: { type: number, example: 19.2644 }
 *               destino_lng: { type: number, example: -103.7372 }
 *     responses:
 *       200:
 *         description: Tarifa calculada exitosamente
 *       401:
 *         description: No autorizado (falta Token)
 */

module.exports = router;
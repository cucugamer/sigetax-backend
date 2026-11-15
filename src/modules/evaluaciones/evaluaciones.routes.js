'use strict';
const router = require('express').Router();
const controller = require('./evaluaciones.controller');
const { verificarToken, verificarRol } = require('../../middlewares/auth');

router.post('/', verificarToken, verificarRol(['pasajero']), controller.calificar);
/**
 * @openapi
 * /evaluaciones:
 *   post:
 *     tags: [Evaluaciones]
 *     summary: Calificar un viaje
 *     description: Registra la calificación (1-5) de un viaje y actualiza el promedio del taxista.
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
 *               calificacion: { type: integer, example: 5 }
 *               comentario: { type: string, example: "Excelente servicio" }
 *     responses:
 *       201:
 *         description: Evaluación guardada
 */
module.exports = router;
'use strict';
const router = require('express').Router();
const controller = require('./auth.controller');
const validate = require('../../middlewares/validate');
const schemas = require('./auth.schemas');

// Rutas Públicas
router.post('/registro/pasajero', validate({ body: schemas.registroPasajero }), controller.registroPasajero);
router.post('/registro/taxista', validate({ body: schemas.registroTaxista }), controller.registroTaxista);
/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Autenticación]
 *     summary: Iniciar sesión de usuario
 *     description: Devuelve un token JWT si las credenciales son válidas.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo_electronico:
 *                 type: string
 *                 example: juan@test.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', validate({ body: schemas.login }), controller.login);

module.exports = router;
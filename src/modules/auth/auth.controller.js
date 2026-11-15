'use strict';
const authService = require('./auth.service');
const asyncHandler = require('../../utils/asyncHandler');

const registroPasajero = asyncHandler(async (req, res) => {
const usuario = await authService.registrarPasajero(req.body);
res.status(201).json({ ok: true, mensaje: 'Pasajero registrado', data: usuario });
});

const registroTaxista = asyncHandler(async (req, res) => {
const usuario = await authService.registrarTaxista(req.body);
res.status(201).json({ ok: true, mensaje: 'Taxista registrado', data: usuario });
});

const login = asyncHandler(async (req, res) => {
const { correo_electronico, password } = req.body;
const data = await authService.login(correo_electronico, password);
res.status(200).json({ ok: true, mensaje: 'Login exitoso', data });
});

module.exports = { registroPasajero, registroTaxista, login };
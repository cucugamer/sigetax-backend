'use strict';
const viajesService = require('./viajes.service');
const asyncHandler = require('../../utils/asyncHandler');

const solicitar = asyncHandler(async (req, res) => {
  const { origen, destino } = req.body;
  const idPasajero = req.user.id_usuario; 
  const viaje = await viajesService.solicitarViaje(idPasajero, origen, destino);
  res.status(201).json({ ok: true, mensaje: 'Viaje solicitado exitosamente', data: viaje });
});

const aceptar = asyncHandler(async (req, res) => {
  const viaje = await viajesService.aceptarViaje(req.params.id, req.user.id_usuario);
  res.status(200).json({ ok: true, mensaje: 'Viaje aceptado', data: viaje });
});

const obtenerPendiente = asyncHandler(async (req, res) => {
  const viaje = await viajesService.obtenerViajePendiente();
  res.status(200).json({ ok: true, data: viaje });
});

const obtenerEstado = asyncHandler(async (req, res) => {
  const viaje = await viajesService.obtenerEstadoViaje(req.params.id);
  res.status(200).json({ ok: true, data: viaje });
});

module.exports = { solicitar, aceptar, obtenerPendiente, obtenerEstado };
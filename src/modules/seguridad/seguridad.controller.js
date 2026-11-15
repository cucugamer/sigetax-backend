'use strict';
const seguridadService = require('./seguridad.service');
const asyncHandler = require('../../utils/asyncHandler');

const rastreoPublico = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const viaje = await seguridadService.obtenerViajePorToken(token);
  
  res.status(200).json({
    ok: true,
    mensaje: 'Información de rastreo obtenida',
    data: viaje
  });
});
const botonPanico = asyncHandler(async (req, res) => {
  const { id_viaje, lat, lng } = req.body;
  const alerta = await seguridadService.generarAlerta(id_viaje, lat, lng);
  res.status(201).json({ ok: true, mensaje: 'ALERTA DE PÁNICO ENVIADA', data: alerta });
});

module.exports = { rastreoPublico, botonPanico };
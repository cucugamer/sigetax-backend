'use strict';
const service = require('./telemetria.service');
const asyncHandler = require('../../utils/asyncHandler');

const enviarUbicacion = asyncHandler(async (req, res) => {
  const { lat, lng } = req.body;
  const result = await service.guardarUbicacion(req.user.id_usuario, lat, lng);
  res.status(201).json({ ok: true, mensaje: 'Ubicación guardada', data: result });
});
module.exports = { enviarUbicacion };
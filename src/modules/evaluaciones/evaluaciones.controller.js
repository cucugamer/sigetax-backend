'use strict';
const service = require('./evaluaciones.service');
const asyncHandler = require('../../utils/asyncHandler');

const calificar = asyncHandler(async (req, res) => {
  const { id_viaje, calificacion, comentario } = req.body;
  const result = await service.calificarViaje(id_viaje, calificacion, comentario);
  res.status(201).json({ ok: true, mensaje: 'Evaluación guardada', data: result });
});
module.exports = { calificar };
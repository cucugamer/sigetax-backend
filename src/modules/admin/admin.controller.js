'use strict';
const adminService = require('./admin.service');
const asyncHandler = require('../../utils/asyncHandler');

const getAlertas = asyncHandler(async (req, res) => {
  const alertas = await adminService.obtenerAlertas();
  res.status(200).json({ ok: true, data: alertas });
});

const getTaxistas = asyncHandler(async (req, res) => {
  const taxistas = await adminService.obtenerTaxistas();
  res.status(200).json({ ok: true, data: taxistas });
});

const putTarifa = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { costo_base, costo_por_km } = req.body;
  const tarifa = await adminService.actualizarTarifa(id, costo_base, costo_por_km);
  res.status(200).json({ ok: true, mensaje: 'Tarifa actualizada', data: tarifa });
});

module.exports = { getAlertas, getTaxistas, putTarifa };
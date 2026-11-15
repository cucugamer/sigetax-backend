'use strict';
const taxistasService = require('./taxistas.service');
const asyncHandler = require('../../utils/asyncHandler');

const obtenerCercanos = asyncHandler(async (req, res) => {
  const { lat, lng, radio } = req.query;
  
  if (!lat || !lng) {
    return res.status(400).json({ ok: false, error: { mensaje: 'Faltan coordenadas (lat, lng)' } });
  }

  const taxis = await taxistasService.obtenerTaxisCercanos(
    Number(lat), 
    Number(lng), 
    radio ? Number(radio) : 5 // Por defecto 5 km
  );

  res.status(200).json({
    ok: true,
    mensaje: `Se encontraron ${taxis.length} taxis cercanos`,
    data: taxis
  });
});

module.exports = { obtenerCercanos };
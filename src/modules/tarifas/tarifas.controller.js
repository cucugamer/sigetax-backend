'use strict';
const tarifasService = require('./tarifas.service');
const asyncHandler = require('../../utils/asyncHandler');

const calcular = asyncHandler(async (req, res) => {
const { origen_lat, origen_lng, destino_lat, destino_lng } = req.body;

const resultado = await tarifasService.calcularTarifa(
    Number(origen_lat), Number(origen_lng), 
    Number(destino_lat), Number(destino_lng)
);

res.status(200).json({
    ok: true,
    mensaje: 'Cálculo de tarifa exitoso',
    data: resultado
});
});

module.exports = { calcular };
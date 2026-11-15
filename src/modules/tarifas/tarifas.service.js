'use strict';
const { pool } = require('../../config/db');
const mapsService = require('./maps.service');
const ApiError = require('../../utils/ApiError');

async function calcularTarifa(origenLat, origenLng, destinoLat, destinoLng) {
  // 1. Obtener la distancia real (Google Maps o Haversine)
const distanciaKm = await mapsService.obtenerDistanciaKm(origenLat, origenLng, destinoLat, destinoLng);

  // 2. Buscar la tarifa vigente (Por ahora tomamos la primera que encontremos en la BD)
const [tarifas] = await pool.query(
    `SELECT id_tarifa, costo_base, costo_por_km FROM Tarifas ORDER BY fecha_vigencia DESC LIMIT 1`
);

if (tarifas.length === 0) {
    throw new ApiError(500, 'No hay tarifas configuradas en el sistema.', 'SIN_TARIFAS');
}

const tarifa = tarifas[0];

  // 3. Aplicar el algoritmo determinista
  // Monto = Costo Base + (Distancia * Costo por Km)
const montoBase = Number(tarifa.costo_base);
const montoPorKm = Number(tarifa.costo_por_km);
  const montoTotal = montoBase + (distanciaKm * montoPorKm);

return {
    id_tarifa: tarifa.id_tarifa,
    distancia_km: distanciaKm,
    monto_estimado: Number(montoTotal.toFixed(2)),
    desglose: {
    costo_base: montoBase,
    costo_por_km: montoPorKm,
    km_recorridos: distanciaKm
    }
};
}

module.exports = { calcularTarifa };
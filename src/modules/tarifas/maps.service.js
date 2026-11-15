'use strict';
const ApiError = require('../../utils/ApiError');

/**
 * Calcula la distancia vial real entre dos puntos usando OSRM (Open Source Routing Machine)
 * a través de los datos abiertos de OpenStreetMap.
 */
async function obtenerDistanciaKm(origenLat, origenLng, destinoLat, destinoLng) {
  try {
    // La API de OSRM usa el formato: longitud,latitud;longitud,latitud
    const url = `http://router.project-osrm.org/route/v1/driving/${origenLng},${origenLat};${destinoLng},${destinoLat}?overview=false`;

    const response = await fetch(url);
    const data = await response.json();

    // Si OSRM encuentra una ruta (código 'Ok')
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new ApiError(400, 'No se pudo calcular la ruta con OSRM.', 'MAPS_ERROR');
    }

    // OSRM devuelve la distancia en metros. La pasamos a kilómetros.
    const distanciaMetros = data.routes[0].distance;
    return Number((distanciaMetros / 1000).toFixed(2));

  } catch (error) {
    // Si falla el internet o el servidor público de OSRM está caído,
    // usamos la fórmula de Haversine como respaldo extremo.
    console.warn('[MAPS] Fallo OSRM. Usando Fórmula de Haversine de respaldo.', error.message);
    
    const R = 6371; // Radio de la Tierra en km
    const dLat = (destinoLat - origenLat) * (Math.PI / 180);
    const dLon = (destinoLng - origenLng) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(origenLat * (Math.PI / 180)) * Math.cos(destinoLat * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(2));
  }
}

module.exports = { obtenerDistanciaKm };
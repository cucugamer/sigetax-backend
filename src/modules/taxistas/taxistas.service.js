'use strict';
const { pool } = require('../../config/db');

/**
 * Busca taxistas disponibles en un radio cercano usando la fórmula de Haversine en SQL.
 */
async function obtenerTaxisCercanos(latPasajero, lngPasajero, radioKm = 5) {
  const query = `
    SELECT 
      t.id_taxista, 
      u.nombre_completo, 
      t.numero_placa, 
      t.modelo_vehiculo, 
      t.color, 
      t.calificacion_promedio,
      ubi.latitud, 
      ubi.longitud,
      ( 6371 * acos( 
          cos( radians(?) ) * cos( radians( ubi.latitud ) ) 
          * cos( radians( ubi.longitud ) - radians(?) ) 
          + sin( radians(?) ) * sin( radians( ubi.latitud ) ) 
      ) ) AS distancia_km
    FROM Taxistas t
    JOIN Usuarios u ON t.id_usuario = u.id_usuario
    JOIN (
      -- Subconsulta para obtener la ÚLTIMA ubicación registrada de cada taxista
      SELECT id_taxista, latitud, longitud
      FROM Ubicaciones_Taxista ut1
      WHERE fecha_hora = (
          SELECT MAX(fecha_hora) 
          FROM Ubicaciones_Taxista ut2 
          WHERE ut2.id_taxista = ut1.id_taxista
      )
    ) ubi ON t.id_taxista = ubi.id_taxista
    WHERE t.estatus_disponibilidad = 'disponible'
    HAVING distancia_km <= ?
    ORDER BY distancia_km ASC;
  `;

  // Parámetros: latPasajero, lngPasajero, latPasajero (para el seno), radioKm
  const [rows] = await pool.execute(query, [latPasajero, lngPasajero, latPasajero, radioKm]);
  return rows;
}

module.exports = { obtenerTaxisCercanos };
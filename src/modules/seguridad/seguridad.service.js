'use strict';
const { pool } = require('../../config/db');
const ApiError = require('../../utils/ApiError');

async function obtenerViajePorToken(token) {
  const [rows] = await pool.execute(
    `SELECT v.id_viaje, v.estado_viaje, v.origen_latitud, v.origen_longitud, 
            v.destino_latitud, v.destino_longitud, v.monto_estimado,
            t.numero_placa, t.modelo_vehiculo, t.color, u.nombre_completo as nombre_taxista
     FROM Viajes v
     LEFT JOIN Taxistas t ON v.id_taxista = t.id_taxista
     LEFT JOIN Usuarios u ON t.id_usuario = u.id_usuario
     WHERE v.token_rastreo = ? LIMIT 1`,
    [token]
  );

  if (rows.length === 0) {
    throw new ApiError(404, 'Enlace de rastreo inválido o expirado.', 'TOKEN_INVALIDO');
  }

  return rows[0];
}

async function generarAlerta(idViaje, lat, lng) {
  const [result] = await pool.execute(
    `INSERT INTO Alertas_Seguridad (id_viaje, latitud_evento, longitud_evento, estatus) 
     VALUES (?, ?, ?, 'activa')`,
    [idViaje, lat, lng]
  );
  return { id_alerta: result.insertId, estatus: 'activa' };
}

module.exports = { obtenerViajePorToken, generarAlerta };
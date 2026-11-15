'use strict';
const { pool } = require('../../config/db');

async function obtenerAlertas() {
  const [rows] = await pool.execute(
    `SELECT a.id_alerta, a.latitud_evento, a.longitud_evento, a.fecha_hora_alerta, a.estatus,
            u.nombre_completo as pasajero
     FROM Alertas_Seguridad a
     JOIN Viajes v ON a.id_viaje = v.id_viaje
     JOIN Usuarios u ON v.id_pasajero = u.id_usuario
     ORDER BY a.fecha_hora_alerta DESC`
  );
  return rows;
}

async function obtenerTaxistas() {
  const [rows] = await pool.execute(
    `SELECT t.id_taxista, u.nombre_completo, t.numero_concesion, t.numero_placa, 
            t.modelo_vehiculo, t.estatus_disponibilidad, t.calificacion_promedio
     FROM Taxistas t
     JOIN Usuarios u ON t.id_usuario = u.id_usuario`
  );
  return rows;
}

async function actualizarTarifa(id, costo_base, costo_por_km) {
  await pool.execute(
    `UPDATE Tarifas SET costo_base = ?, costo_por_km = ? WHERE id_tarifa = ?`,
    [costo_base, costo_por_km, id]
  );
  return { id_tarifa: id, costo_base, costo_por_km };
}

module.exports = { obtenerAlertas, obtenerTaxistas, actualizarTarifa };
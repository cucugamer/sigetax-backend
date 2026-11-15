'use strict';
const crypto = require('crypto');
const { pool, withTransaction } = require('../../config/db'); // <-- Importante withTransaction
const tarifasService = require('../tarifas/tarifas.service');
const ApiError = require('../../utils/ApiError'); // <-- Importante ApiError

async function solicitarViaje(idPasajero, origen, destino) {
  const calculo = await tarifasService.calcularTarifa(
    Number(origen.lat), Number(origen.lng),
    Number(destino.lat), Number(destino.lng)
  );

  const tokenRastreo = crypto.randomBytes(32).toString('hex');

  const [result] = await pool.execute(
    `INSERT INTO Viajes (
      id_pasajero, id_tarifa, origen_latitud, origen_longitud, 
      destino_latitud, destino_longitud, distancia_km, monto_estimado, 
      estado_viaje, token_rastreo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'solicitado', ?)`,
    [
      idPasajero, calculo.id_tarifa,
      origen.lat, origen.lng,
      destino.lat, destino.lng,
      calculo.distancia_km, calculo.monto_estimado,
      tokenRastreo
    ]
  );

  return {
    id_viaje: result.insertId,
    estado: 'solicitado',
    distancia_km: calculo.distancia_km,
    monto_estimado: calculo.monto_estimado,
    token_rastreo: tokenRastreo
  };
}

async function aceptarViaje(idViaje, idUsuarioTaxista) {
  return await withTransaction(async (conn) => {
    // 1. Obtener el id_taxista
    const [taxistas] = await conn.execute('SELECT id_taxista FROM Taxistas WHERE id_usuario = ?', [idUsuarioTaxista]);
    if (taxistas.length === 0) throw new ApiError(404, 'Perfil de taxista no encontrado.');
    const idTaxista = taxistas[0].id_taxista;

    // 2. Actualizar el viaje
    const [result] = await conn.execute(
      `UPDATE Viajes SET id_taxista = ?, estado_viaje = 'aceptado' WHERE id_viaje = ? AND estado_viaje = 'solicitado'`,
      [idTaxista, idViaje]
    );

    if (result.affectedRows === 0) throw new ApiError(400, 'El viaje no está disponible o ya fue aceptado.');

    // 3. Poner al taxista como ocupado
    await conn.execute(`UPDATE Taxistas SET estatus_disponibilidad = 'ocupado' WHERE id_taxista = ?`, [idTaxista]);

    return { id_viaje: idViaje, estado: 'aceptado', id_taxista: idTaxista };
  });
}
async function obtenerViajePendiente() {
  const [rows] = await pool.execute(
    `SELECT id_viaje, origen_latitud, origen_longitud, monto_estimado 
     FROM Viajes WHERE estado_viaje = 'solicitado' 
     ORDER BY fecha_hora_inicio ASC LIMIT 1`
  );
  return rows[0] || null;
}
async function obtenerEstadoViaje(idViaje) {
  const [rows] = await pool.execute(
    `SELECT v.id_viaje, v.estado_viaje, v.monto_estimado,
            t.numero_placa, t.modelo_vehiculo, t.color, t.calificacion_promedio,
            u.nombre_completo as nombre_taxista
     FROM Viajes v
     LEFT JOIN Taxistas t ON v.id_taxista = t.id_taxista
     LEFT JOIN Usuarios u ON t.id_usuario = u.id_usuario
     WHERE v.id_viaje = ? LIMIT 1`,
    [idViaje]
  );
  return rows[0] || null;
}
module.exports = { solicitarViaje, aceptarViaje, obtenerViajePendiente, obtenerEstadoViaje };
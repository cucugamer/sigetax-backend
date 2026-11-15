'use strict';
const { pool, withTransaction } = require('../../config/db');

async function calificarViaje(idViaje, calificacion, comentario) {
  return await withTransaction(async (conn) => {
    // 1. Guardar la evaluación
    await conn.execute(
      `INSERT INTO Evaluaciones (id_viaje, calificacion, comentario) VALUES (?, ?, ?)`,
      [idViaje, calificacion, comentario]
    );

    // 2. Obtener el id_taxista de ese viaje
    const [viajes] = await conn.execute(`SELECT id_taxista FROM Viajes WHERE id_viaje = ?`, [idViaje]);
    const idTaxista = viajes[0].id_taxista;

    // 3. Calcular el nuevo promedio del taxista
    const [promedios] = await conn.execute(
      `SELECT AVG(calificacion) as promedio FROM Evaluaciones e 
       JOIN Viajes v ON e.id_viaje = v.id_viaje WHERE v.id_taxista = ?`,
      [idTaxista]
    );
    
    const nuevoPromedio = Number(promedios[0].promedio).toFixed(2);

    // 4. Actualizar la tabla Taxistas
    await conn.execute(`UPDATE Taxistas SET calificacion_promedio = ? WHERE id_taxista = ?`, [nuevoPromedio, idTaxista]);

    // 5. Marcar el viaje como finalizado
    await conn.execute(`UPDATE Viajes SET estado_viaje = 'finalizado', fecha_hora_fin = NOW() WHERE id_viaje = ?`, [idViaje]);

    return { id_viaje: idViaje, calificacion, nuevo_promedio: nuevoPromedio };
  });
}

module.exports = { calificarViaje };
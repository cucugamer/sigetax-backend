'use strict';
const { pool } = require('../../config/db');

async function guardarUbicacion(idUsuarioTaxista, lat, lng) {
  const [taxistas] = await pool.execute('SELECT id_taxista FROM Taxistas WHERE id_usuario = ?', [idUsuarioTaxista]);
  const idTaxista = taxistas[0].id_taxista;

  await pool.execute(
    'INSERT INTO Ubicaciones_Taxista (id_taxista, latitud, longitud) VALUES (?, ?, ?)',
    [idTaxista, lat, lng]
  );
  return { id_taxista: idTaxista, lat, lng };
}
module.exports = { guardarUbicacion };
'use strict';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool, withTransaction } = require('../../config/db');
const { jwt: jwtCfg, bcrypt: bcryptCfg } = require('../../config/env');
const ApiError = require('../../utils/ApiError');

// Función auxiliar para generar el token
const generarToken = (usuario) => {
return jwt.sign(
    { id_usuario: usuario.id_usuario, rol: usuario.rol },
    jwtCfg.secret,
    { expiresIn: jwtCfg.expiresIn }
);
};

async function registrarPasajero(datos) {
const hash = await bcrypt.hash(datos.password, bcryptCfg.rounds);
const [result] = await pool.execute(
    `INSERT INTO Usuarios (nombre_completo, correo_electronico, telefono, password_hash, rol) 
    VALUES (?, ?, ?, ?, 'pasajero')`,
    [datos.nombre_completo, datos.correo_electronico, datos.telefono, hash]
);

return { id_usuario: result.insertId, rol: 'pasajero', nombre_completo: datos.nombre_completo };
}

async function registrarTaxista(datos) {
const hash = await bcrypt.hash(datos.password, bcryptCfg.rounds);

  // Usamos la transacción para guardar en Usuarios y Taxistas al mismo tiempo
const resultado = await withTransaction(async (conn) => {
    const [userResult] = await conn.execute(
    `INSERT INTO Usuarios (nombre_completo, correo_electronico, telefono, password_hash, rol) 
    VALUES (?, ?, ?, ?, 'taxista')`,
    [datos.nombre_completo, datos.correo_electronico, datos.telefono, hash]
    );

    const idUsuario = userResult.insertId;

    await conn.execute(
    `INSERT INTO Taxistas (id_usuario, numero_concesion, numero_placa, modelo_vehiculo, color) 
    VALUES (?, ?, ?, ?, ?)`,
    [idUsuario, datos.numero_concesion, datos.numero_placa, datos.modelo_vehiculo, datos.color]
    );

    return { id_usuario: idUsuario, rol: 'taxista', nombre_completo: datos.nombre_completo };
});

return resultado;
}

async function login(correo, password) {
const [rows] = await pool.execute(
    `SELECT id_usuario, nombre_completo, password_hash, rol, activo 
    FROM Usuarios WHERE correo_electronico = ? LIMIT 1`,
    [correo]
);

const usuario = rows[0];
if (!usuario) throw new ApiError(401, 'Credenciales inválidas.', 'CREDENCIALES');

if (!usuario.activo) throw new ApiError(403, 'Cuenta desactivada.', 'CUENTA_INACTIVA');

const passwordOk = await bcrypt.compare(password, usuario.password_hash);
if (!passwordOk) throw new ApiError(401, 'Credenciales inválidas.', 'CREDENCIALES');

const token = generarToken(usuario);
  delete usuario.password_hash; // No enviar el hash en la respuesta

return { usuario, token };
}

module.exports = { registrarPasajero, registrarTaxista, login };
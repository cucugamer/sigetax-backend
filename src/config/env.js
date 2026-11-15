'use strict';
require('dotenv').config();

const required = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length > 0) {
console.error(`[env] Faltan variables de entorno requeridas: ${missing.join(', ')}`);
process.exit(1);
}

module.exports = {
NODE_ENV: process.env.NODE_ENV || 'development',
PORT: Number(process.env.PORT) || 3000,
db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
},
jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
},
bcrypt: { rounds: Number(process.env.BCRYPT_ROUNDS) || 12 },
cors: { origin: (process.env.CORS_ORIGIN || '').split(',').filter(Boolean) },
// 👇 ESTO ES LO NUEVO 👇
  googleMaps: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY,
  },
};
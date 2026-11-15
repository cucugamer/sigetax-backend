'use strict';
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const { NODE_ENV } = require('../config/env');

function errorHandler(err, req, res, next) {
if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ ok: false, error: { codigo: err.codigo || 'ERROR', mensaje: err.message, ...(err.detalles ? { detalles: err.detalles } : {}) } });
}
if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ ok: false, error: { codigo: 'DUPLICADO', mensaje: 'El recurso ya existe.' } });
if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') return res.status(401).json({ ok: false, error: { codigo: 'TOKEN_INVALIDO', mensaje: 'Token inválido o expirado.' } });

logger.error({ err, path: req.originalUrl }, 'Error no controlado');
return res.status(500).json({ ok: false, error: { codigo: 'ERROR_INTERNO', mensaje: 'Error interno del servidor.', ...(NODE_ENV !== 'production' ? { stack: err.stack } : {}) } });
}
module.exports = errorHandler;
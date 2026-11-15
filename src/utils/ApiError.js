'use strict';
class ApiError extends Error {
constructor(statusCode, message, codigo = null, detalles = null) {
    super(message);
    this.statusCode = statusCode;
    this.codigo = codigo;
    this.detalles = detalles;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
}
}
module.exports = ApiError;
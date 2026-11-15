'use strict';
const ApiError = require('../utils/ApiError');
module.exports = (req, res, next) => next(new ApiError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`, 'NO_ENCONTRADA'));
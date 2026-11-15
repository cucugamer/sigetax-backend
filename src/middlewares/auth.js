'use strict';

const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const { jwt: jwtCfg } = require('../config/env');

/**
 * Verifica el JWT del header Authorization: Bearer <token>
 * y adjunta el payload en req.user = { id_usuario, rol }.
 */
function verificarToken(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new ApiError(401, 'Token no proporcionado.', 'SIN_TOKEN'));
  }

  try {
    const payload = jwt.verify(token, jwtCfg.secret);
    req.user = payload;
    return next();
  } catch (err) {
    return next(err); // errorHandler maneja JsonWebTokenError / TokenExpiredError
  }
}

/**
 * RBAC: restringe el acceso a los roles especificados.
 * Uso: router.post('/', verificarToken, verificarRol(['administrador']), handler)
 */
function verificarRol(rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'No autenticado.', 'SIN_AUTENTICACION'));
    }
    if (!rolesPermitidos.includes(req.user.rol)) {
      return next(new ApiError(403, 'No tiene permisos para esta operación.', 'SIN_PERMISOS'));
    }
    return next();
  };
}

module.exports = { verificarToken, verificarRol };
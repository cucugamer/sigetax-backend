'use strict';

const ApiError = require('../utils/ApiError');

/**
 * Middleware genérico de validación con Joi.
 * @param {Object} schemas  { body?, params?, query? }
 */
function validate(schemas) {
return (req, res, next) => {
    const errores = [];

    for (const key of ['params', 'query', 'body']) {
    if (!schemas[key]) continue;

    const { error, value } = schemas[key].validate(req[key], {
        abortEarly: false,
        stripUnknown: true,
        convert: true,
    });

    if (error) {
        errores.push(
        ...error.details.map((d) => ({ campo: d.path.join('.'), mensaje: d.message }))
        );
    } else {
        req[key] = value; // deja el payload normalizado
    }
    }

    if (errores.length > 0) {
    return next(new ApiError(400, 'Datos de entrada inválidos.', 'VALIDACION', errores));
    }
    return next();
};
}

module.exports = validate;
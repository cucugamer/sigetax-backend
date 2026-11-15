'use strict';
const Joi = require('joi');

const passwordSchema = Joi.string().min(8).max(50).required()
  .messages({ 'string.min': 'La contraseña debe tener al menos 8 caracteres.' });

const registroPasajero = Joi.object({
  nombre_completo: Joi.string().max(150).required(),
  correo_electronico: Joi.string().email().max(150).required(),
  telefono: Joi.string().max(15).required(),
  password: passwordSchema,
});

const registroTaxista = registroPasajero.keys({
  numero_concesion: Joi.string().max(50).required(),
  numero_placa: Joi.string().max(20).required(),
  modelo_vehiculo: Joi.string().max(100).required(),
  color: Joi.string().max(30).required(),
});

const login = Joi.object({
  correo_electronico: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { registroPasajero, registroTaxista, login };
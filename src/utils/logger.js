'use strict';
const pino = require('pino');
const { NODE_ENV } = require('../config/env');
const logger = pino({
level: NODE_ENV === 'production' ? 'info' : 'debug',
transport: NODE_ENV === 'production' ? undefined : { target: 'pino-pretty', options: { colorize: true } },
redact: { paths: ['req.headers.authorization', 'req.body.password'], censor: '[REDACTED]' },
});
module.exports = logger;
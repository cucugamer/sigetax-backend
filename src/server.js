'use strict';
const app = require('./app');
const { PORT, NODE_ENV } = require('./config/env');
const { pool } = require('./config/db');
const logger = require('./utils/logger');

const server = app.listen(PORT, () => {
logger.info(`[SIGETAX] Servidor escuchando en http://localhost:${PORT} (${NODE_ENV})`);
});

process.on('SIGINT', async () => {
server.close(async () => {
    await pool.end();
    process.exit(0);
});
});
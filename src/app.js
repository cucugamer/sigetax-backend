'use strict';
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express'); // <-- Swagger 1
const swaggerSpec = require('./config/swagger'); // <-- Swagger 2

const { cors: corsCfg } = require('./config/env');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');
const { ping } = require('./config/db');

const authRoutes = require('./modules/auth/auth.routes');
const tarifasRoutes = require('./modules/tarifas/tarifas.routes');
const viajesRoutes = require('./modules/viajes/viajes.routes');
const seguridadRoutes = require('./modules/seguridad/seguridad.routes');
const telemetriaRoutes = require('./modules/telemetria/telemetria.routes');
const evaluacionesRoutes = require('./modules/evaluaciones/evaluaciones.routes');
const taxistasRoutes = require('./modules/taxistas/taxistas.routes');
const adminRoutes = require('./modules/admin/admin.routes');

const app = express();

// 1. Middlewares base
app.use(helmet());
app.use(cors({ origin: corsCfg.origin.length ? corsCfg.origin : true }));
app.use(express.json({ limit: '100kb' }));

// 2. Documentación (Swagger)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 3. Health check
app.get('/health', async (req, res) => {
  try {
    const dbOk = await ping();
    res.status(200).json({ ok: true, db: dbOk ? 'up' : 'down', ts: new Date().toISOString() });
  } catch (err) {
    res.status(503).json({ ok: false, db: 'down' });
  }
});

// 4. Rutas de negocio
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tarifas', tarifasRoutes);
app.use('/api/v1/viajes', viajesRoutes);
app.use('/api/v1/seguridad', seguridadRoutes);
app.use('/api/v1/telemetria', telemetriaRoutes);
app.use('/api/v1/evaluaciones', evaluacionesRoutes);
app.use('/api/v1/taxistas', taxistasRoutes);
app.use('/api/v1/admin', adminRoutes);

// 5. Manejo de errores (SIEMPRE AL FINAL)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
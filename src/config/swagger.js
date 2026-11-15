'use strict';
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SIGETAX API',
      version: '1.0.0',
      description: 'API REST para el Sistema de localización de taxis y cálculo de tarifas (Colima y Villa de Álvarez).',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Servidor de Desarrollo Local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Busca los comentarios de documentación en los archivos de rutas
  apis: ['./src/modules/*/*.routes.js'], 
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
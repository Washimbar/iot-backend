module.exports = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'IoT Device Control API',
        version: '1.0.0',
        description: 'API for managing switches, fan, and RGB lights in an IoT system',
      },
      servers: [
        {
          url: 'http://localhost:3005/api',
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
    },
    apis: ['./routes/*.js', './controllers/*.js'],
  };
  
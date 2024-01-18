import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'API',
      description: 'An API for platform',
      version: '',
    },
  },
  apis: ["**/*.ts"],
};

const specs = swaggerJSDoc(options);
export default specs;

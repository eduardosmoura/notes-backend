const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./controllers/auth', './controllers/notes', './controllers/search', './controllers/users']

swaggerAutogen(outputFile, endpointsFiles)

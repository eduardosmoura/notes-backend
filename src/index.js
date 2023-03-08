require('dotenv').config()
require('./mongo')

const rateLimit = require('express-rate-limit')
const cors = require('cors')
const express = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const app = express()

const notFound = require('./middleware/notFound')
const handleError = require('./middleware/handleError')

const usersRouter = require('./controllers/users')
const authRouter = require('./controllers/auth')
const notesRouter = require('./controllers/notes')
const searchRouter = require('./controllers/search')

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  })
)

app.use(cors())
app.use(express.json())

app.use('/api/auth/signup', usersRouter)
app.use('/api/auth/login', authRouter)
app.use('/api/notes', notesRouter)
app.use('/api/search', searchRouter)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use(handleError)
app.use(notFound)

const PORT = process.env.PORT
const server = app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`)
})

module.exports = { app, server }

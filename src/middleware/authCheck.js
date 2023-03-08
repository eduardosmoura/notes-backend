const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {
  const authHeader = request.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const { id: userId } = decodedToken
  request.userId = userId
  next()
}

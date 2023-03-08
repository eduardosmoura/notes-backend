const searchRouter = require('express').Router()
const Note = require('../models/Note')
const authCheck = require('../middleware/authCheck')

searchRouter.get('/', authCheck, async (request, response, next) => {
  try {
    const { q } = request.query
    if (!q) {
      return response.status(400).json({
        error: 'Required "q" param is missing'
      })
    }
    const notes = await Note.find({ $or: [{ user: request.userId }, { shares: request.userId }], $text: { $search: q } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } })
    response.json(notes)
  } catch (error) {
    next(error)
  }
})

module.exports = searchRouter

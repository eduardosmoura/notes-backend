const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')
const authCheck = require('../middleware/authCheck')

notesRouter.get('/', authCheck, async (request, response, next) => {
  try {
    const notes = await Note.find({ $or: [{ user: request.userId }, { shares: request.userId }] })
    response.json(notes)
  } catch (error) {
    next(error)
  }
})

notesRouter.get('/:id', authCheck, async (request, response, next) => {
  try {
    const { id } = request.params
    const note = await Note.findOne({ _id: id, $or: [{ user: request.userId }, { shares: request.userId }] })
    return note
      ? response.json(note)
      : response.status(404).end()
  } catch (error) {
    next(error)
  }
})

notesRouter.put('/:id', authCheck, async (request, response, next) => {
  try {
    const { id } = request.params
    const newNoteInfo = {
      content: request.body.content
    }
    const result = await Note.findOneAndUpdate({ _id: id, $or: [{ user: request.userId }, { shares: request.userId }] }, newNoteInfo, { new: true })
    response.json(result)
  } catch (error) {
    next(error)
  }
})

notesRouter.delete('/:id', authCheck, async (request, response, next) => {
  try {
    const { id } = request.params
    const res = await Note.findOneAndDelete({ _id: id, $or: [{ user: request.userId }, { shares: request.userId }] })
    if (res === null) return response.sendStatus(404)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

notesRouter.post('/', authCheck, async (request, response, next) => {
  try {
    const {
      content
    } = request.body
    const { userId } = request
    const user = await User.findById(userId)
    if (!content) {
      return response.status(400).json({
        error: 'Required "content" field is missing'
      })
    }
    const newNote = new Note({
      content,
      date: new Date(),
      user: user._id
    })
    const savedNote = await newNote.save()
    response.json(savedNote)
  } catch (error) {
    next(error)
  }
})

notesRouter.post('/:id/share', authCheck, async (request, response, next) => {
  try {
    const { id } = request.params
    const {
      user: otherUserId
    } = request.body
    if (!otherUserId) {
      return response.status(400).json({
        error: 'Required "user" field is missing'
      })
    }
    const note = await Note.findOne({ _id: id, user: request.userId })
    const user = await User.findById(otherUserId)
    if (!note || !user) {
      response.status(404).end()
    }
    note.shares = note.shares.concat(user._id)
    await note.save()
    response.status(201).end()
  } catch (error) {
    next(error)
  }
})

module.exports = notesRouter

const { Schema, model } = require('mongoose')

const noteSchema = new Schema({
  content: { type: String, index: 'text' },
  date: Date,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  shares: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = model('Note', noteSchema)

module.exports = Note

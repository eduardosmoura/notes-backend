const bcrypt = require('bcrypt')
const { faker } = require('@faker-js/faker')
const supertest = require('supertest')
const { server } = require('../index')
const User = require('../models/User')
const Note = require('../models/Note')

const api = supertest(server)

const mockNotes = [
  {
    content: faker.lorem.sentence(),
    date: new Date()
  },
  {
    content: faker.lorem.sentence(),
    date: new Date()
  },
  {
    content: faker.lorem.sentence(),
    date: new Date()
  }
]

const mockUser = {
  username: faker.internet.userName(),
  password: faker.internet.password()
}

const clearUsers = async () => {
  await User.deleteMany({})
}

const clearNotes = async () => {
  await Note.deleteMany({})
}

const createUser = async () => {
  const passwordHash = await bcrypt.hash(mockUser.password, 10)
  const user = new User({ username: mockUser.username, passwordHash })
  return await user.save()
}

const createNotes = async () => {
  let user = await getUser(mockUser.username)
  if (!user) {
    user = await createUser()
  }
  for (const note of mockNotes) {
    note.user = user._id
    const noteObject = new Note(note)
    await noteObject.save()
  }
}

const getAllUsers = async () => {
  const usersDB = await User.find({})
  return usersDB.map(user => user.toJSON())
}

const getUser = async (username) => {
  return await User.findOne({ username })
}

const getAllNotes = async () => {
  const notesDB = await Note.find({})
  return notesDB.map(note => note.toJSON())
}

module.exports = {
  api,
  mockUser,
  mockNotes,
  getAllUsers,
  getAllNotes,
  getUser,
  clearUsers,
  clearNotes,
  createUser,
  createNotes
}

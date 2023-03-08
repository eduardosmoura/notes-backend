const moongose = require('mongoose')
const sinon = require('sinon')
const jwt = require('jsonwebtoken')
const { api, mockUser, mockNotes, clearUsers, clearNotes, createUser, createNotes, getUser } = require('./utils')
const { server } = require('../index')

describe('search', () => {
  beforeAll(async () => {
    await clearUsers()
    await createUser()
    const user = await getUser(mockUser.username)
    sinon.stub(jwt, 'verify').callsFake(() => {
      return { id: user._id }
    })
  })

  describe('GET /api/search', () => {
    beforeAll(async () => {
      await clearNotes()
      await createNotes()
    })

    describe('when user is authenticated', () => {
      test('should return all matched notes with a 200 status code', async () => {
        const { body } = await api
          .get('/api/search')
          .query({ q: mockNotes[0].content })
          .set('Authorization', 'Bearer test')
          .expect(200)
          .expect('Content-Type', /application\/json/)

        expect(body.length).toBeGreaterThan(0)
      })
    })

    describe('when user is not authenticated', () => {
      test('should respond with a 401 status code and an error message', async () => {
        const { body: error } = await api
          .get('/api/search')
          .query({ q: mockNotes[0].content })
          .expect(401)
          .expect('Content-Type', /application\/json/)

        expect(error.error).toContain('token missing or invalid')
      })
    })
  })

  afterAll(() => {
    moongose.connection.close()
    server.close()
  })
})

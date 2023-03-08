const moongose = require('mongoose')
const sinon = require('sinon')
const jwt = require('jsonwebtoken')
const { faker } = require('@faker-js/faker')
const { api, mockUser, mockNotes, clearUsers, clearNotes, createUser, createNotes, getUser, getAllNotes } = require('./utils')
const { server } = require('../index')

describe('notes', () => {
  beforeAll(async () => {
    await clearUsers()
    await createUser()
    const user = await getUser(mockUser.username)
    sinon.stub(jwt, 'verify').callsFake(() => {
      return { id: user._id }
    })
  })

  describe('GET /api/notes', () => {
    beforeAll(async () => {
      await clearNotes()
      await createNotes()
    })

    describe('when user is authenticated', () => {
      test('should return all notes with a 200 status code', async () => {
        const { body } = await api
          .get('/api/notes')
          .set('Authorization', 'Bearer test')
          .expect(200)
          .expect('Content-Type', /application\/json/)

        expect(body).toHaveLength(mockNotes.length)
      })
    })

    describe('when user is not authenticated', () => {
      test('should respond with a 401 status code and an error message', async () => {
        const { body: error } = await api
          .get('/api/notes')
          .expect(401)
          .expect('Content-Type', /application\/json/)

        expect(error.error).toContain('token missing or invalid')
      })
    })
  })

  describe('GET /api/notes/id', () => {
    beforeAll(async () => {
      await clearNotes()
      await createNotes()
    })

    describe('when user is authenticated', () => {
      test('should return one note with a 200 status code', async () => {
        const note = (await getAllNotes())[0]
        const { body } = await api
          .get(`/api/notes/${note.id}`)
          .set('Authorization', 'Bearer test')
          .expect(200)
          .expect('Content-Type', /application\/json/)

        expect(body.content).toEqual(note.content)
      })
    })

    describe('when user is not authenticated', () => {
      test('should respond with a 401 status code and an error message', async () => {
        const note = (await getAllNotes())[0]
        const { body: error } = await api
          .get(`/api/notes/${note.id}`)
          .expect(401)
          .expect('Content-Type', /application\/json/)

        expect(error.error).toContain('token missing or invalid')
      })
    })
  })

  describe('POST /api/notes', () => {
    beforeAll(async () => {
      await clearNotes()
    })

    describe('when user is authenticated', () => {
      test('should create a note with a 200 status code', async () => {
        const { body } = await api
          .post('/api/notes')
          .send(mockNotes[0])
          .set('Authorization', 'Bearer test')
          .expect(200)
          .expect('Content-Type', /application\/json/)

        expect(body.content).toEqual(mockNotes[0].content)
      })
    })

    describe('when user is not authenticated', () => {
      test('should respond with a 401 status code and an error message', async () => {
        const { body: error } = await api
          .post('/api/notes')
          .send(mockNotes[0])
          .expect(401)
          .expect('Content-Type', /application\/json/)

        expect(error.error).toContain('token missing or invalid')
      })
    })
  })

  describe('PUT /api/notes/id', () => {
    beforeAll(async () => {
      await clearNotes()
      await createNotes()
    })

    describe('when user is authenticated', () => {
      test('should update one note with a 200 status code', async () => {
        const content = faker.lorem.sentence()
        const note = (await getAllNotes())[0]
        const { body } = await api
          .put(`/api/notes/${note.id}`)
          .send({ content })
          .set('Authorization', 'Bearer test')
          .expect(200)
          .expect('Content-Type', /application\/json/)

        expect(body.content).toEqual(content)
      })
    })

    describe('when user is not authenticated', () => {
      test('should respond with a 401 status code and an error message', async () => {
        const content = faker.lorem.sentence()
        const note = (await getAllNotes())[0]
        const { body: error } = await api
          .put(`/api/notes/${note.id}`)
          .send({ content })
          .expect(401)
          .expect('Content-Type', /application\/json/)

        expect(error.error).toContain('token missing or invalid')
      })
    })
  })

  describe('DELETE /api/notes/id', () => {
    beforeAll(async () => {
      await clearNotes()
      await createNotes()
    })

    describe('when user is authenticated', () => {
      test('should delete one note with a 204 status code', async () => {
        const note = (await getAllNotes())[0]
        await api
          .delete(`/api/notes/${note.id}`)
          .set('Authorization', 'Bearer test')
          .expect(204)
      })
    })

    describe('when user is not authenticated', () => {
      test('should respond with a 401 status code and an error message', async () => {
        const note = (await getAllNotes())[0]
        const { body: error } = await api
          .delete(`/api/notes/${note.id}`)
          .expect(401)
          .expect('Content-Type', /application\/json/)

        expect(error.error).toContain('token missing or invalid')
      })
    })
  })

  describe('POST /api/notes/id/share', () => {
    beforeAll(async () => {
      await clearNotes()
      await createNotes()
    })

    describe('when user is authenticated', () => {
      test('should share a note with a 201 status code', async () => {
        const user = await getUser(mockUser.username)
        const note = (await getAllNotes())[0]
        await api
          .post(`/api/notes/${note.id}/share`)
          .send({ user: user.id })
          .set('Authorization', 'Bearer test')
          .expect(201)
      })
    })

    describe('when user is not authenticated', () => {
      test('should respond with a 401 status code and an error message', async () => {
        const user = await getUser(mockUser.username)
        const note = (await getAllNotes())[0]
        const { body: error } = await api
          .post(`/api/notes/${note.id}/share`)
          .send({ user: user.id })
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

const moongose = require('mongoose')
const { faker } = require('@faker-js/faker')
const { api, mockUser, clearUsers, createUser } = require('./utils')
const { server } = require('../index')

const existingUser = {
  username: faker.internet.userName(),
  password: faker.internet.password()
}

const url = '/api/auth/login'

describe('auth', () => {
  describe(`POST ${url}`, () => {
    beforeAll(async () => {
      await clearUsers()
      await createUser()
    })

    describe('when passed a username and password', () => {
      test('should respond with a 200 status code', async () => {
        const { body: token } = await api
          .post(url)
          .send(mockUser)
          .expect(200)
          .expect('Content-Type', /application\/json/)

        expect(token).toBeDefined()
      })
    })

    describe('when username or password is invalid', () => {
      test('should respond with a 401 status code and an error message', async () => {
        const { body: error } = await api
          .post(url)
          .send(existingUser)
          .expect(401)
          .expect('Content-Type', /application\/json/)

        expect(error.error).toContain('invalid username or password')
      })
    })

    afterAll(() => {
      moongose.connection.close()
      server.close()
    })
  })
})

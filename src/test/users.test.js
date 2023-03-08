const moongose = require('mongoose')
const { faker } = require('@faker-js/faker')
const { api, clearUsers, getAllUsers } = require('./utils')
const { server } = require('../index')

const newUser = {
  username: faker.internet.userName(),
  name: faker.name.fullName(),
  password: faker.internet.password()
}

const url = '/api/auth/signup'

describe('users', () => {
  describe(`POST ${url}`, () => {
    beforeAll(async () => {
      await clearUsers()
    })

    describe('when passed a username and password', () => {
      test('should respond with a 201 status code', async () => {
        const initialUsers = await getAllUsers()

        await api
          .post(url)
          .send(newUser)
          .expect(201)
          .expect('Content-Type', /application\/json/)

        const endUsers = await getAllUsers()
        const usernames = endUsers.map(u => u.username)

        expect(endUsers).toHaveLength(initialUsers.length + 1)
        expect(usernames).toContain(newUser.username)
      })
    })

    describe('when username is taken', () => {
      test('should respond with a 409 status code and an error message', async () => {
        const initialUsers = await getAllUsers()

        const { body: error } = await api
          .post(url)
          .send(newUser)
          .expect(409)
          .expect('Content-Type', /application\/json/)

        const endUsers = await getAllUsers()

        expect(error.error).toContain('expected username to be unique')
        expect(endUsers).toHaveLength(initialUsers.length)
      })
    })

    afterAll(() => {
      moongose.connection.close()
      server.close()
    })
  })
})

import request from 'supertest'
import faker from 'faker'
import { expect } from 'chai'
import mongoose from 'mongoose'
import app from './../../../src/app'
import { User } from './../../../src/models/User'

const userPayload = {
  name: 'test',
  email: 'test@test.com',
  password: 'test'
}

interface FakeUser {
  name: String
  email: String
  password: String
}

before(async () => {
  await mongoose.connect('mongodb://localhost:27017/biturl')
    .catch(err => console.log(err))
})

describe('routes/auth', () => {
  describe('sign-up', () => {
    let fakeUser: FakeUser
    beforeEach(() => {
      fakeUser = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'test'
      }
    })

    it('should return 201 and signup user', async () => {
      const req = request(app)
      const res = await req.post('/auth/sign-up')
        .set('Content-Type', 'application/json')
        .send(fakeUser)

      expect(res.status).to.equal(201)
      expect(res.body).not.to.have.property('password')
      expect(res.body).to.have.property('id')
      expect(res.body.name).to.equal(fakeUser.name)
      expect(res.body.email).to.equal(fakeUser.email)

      if (!mongoose.Types.ObjectId.isValid(res.body.id)) throw new Error('Invalid object id')
      const user = await User.findById(res.body.id)
      if (user === null) throw new Error('User not found')

      expect(res.body.id).to.equal(user._id.toString())
      expect(user.password).to.not.equal(fakeUser.password)
      expect(res.body.name).to.equal(user.name)
    })
  })

  describe('auth/sign-in', () => {
    it('should return 200 and auth user if email and password match', async () => {
      const req = request(app)
      const res = await req.post('/auth/sign-in')
        .set('Content-Type', 'application/json')
        .send({
          email: userPayload.email,
          password: userPayload.password
        })

      expect(res.status).to.equal(200)
      expect(res.body.user).to.have.property('id')
      expect(res.body.user.name).to.equal(userPayload.name)
      expect(res.body.user.email).to.equal(userPayload.email)
      expect(res.body.user).not.to.have.property('password')
      expect(res.body).to.have.property('token')
      expect(res.body.token).to.be.a('string')
    })

    it('should return 400 if email is missing', async () => {
      const req = request(app)
      const res = await req.post('/auth/sign-in')
        .set('Content-Type', 'application/json')
        .send({
          password: userPayload.password
        })

      expect(res.status).to.equal(400)
      expect(res.body).to.have.property('errors')
    })

    it('should return 400 if password is missing', async () => {
      const req = request(app)
      const res = await req.post('/auth/sign-in')
        .set('Content-Type', 'application/json')
        .send({
          email: userPayload.email
        })

      expect(res.status).to.equal(400)
      expect(res.body).to.have.property('errors')
    })

    it('should return 400 if there are no users with that email', async () => {
      const credentials = {
        email: faker.internet.email().toLowerCase(),
        password: 'test'
      }
      const req = request(app)
      const res = await req.post('/auth/sign-in')
        .set('Content-Type', 'application/json')
        .send({
          email: credentials.email,
          password: credentials.password
        })

      expect(res.status).to.equal(400)
      expect(res.body).to.have.property('errors')
    })
  })
})

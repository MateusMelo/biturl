import request from 'supertest'
import faker from 'faker'
import { expect } from 'chai'
import { connect, Types } from 'mongoose'
import app from './../../../src/app'
import { User } from './../../../src/models/User'
import { UserToken } from './../../../src/models/UserToken'
import { createUser, removeUser, userPayload, invalidEmailUserPayload } from './../../mocks/user.mock'

describe('routes/auth', () => {
  before(async () => {
    await connect('mongodb://localhost:27017/biturl-test')
      .catch(err => console.log(err))

    await User.deleteMany({})
    await UserToken.deleteMany({})
  })
  after(async () => {
    await User.deleteMany({})
    await UserToken.deleteMany({})
  })

  describe('POST /auth/sign-up', () => {
    afterEach(async () => {
      await removeUser(userPayload)
    })

    it('should return 201 and signup user', async () => {
      const req = request(app)
      const res = await req.post('/auth/sign-up')
        .set('Content-Type', 'application/json')
        .send(userPayload)

      expect(res.status).to.equal(201)
      expect(res.body).to.have.property('user')
      expect(res.body.user).to.have.property('id')
      expect(res.body.user).not.to.have.property('password')
      expect(res.body.user.name).to.equal(userPayload.name)
      expect(res.body.user.email).to.equal(userPayload.email)
      expect(res.body).to.have.property('token')
      expect(res.body.token).to.have.property('access')
      expect(res.body.token).to.have.property('expiresAt')

      if (!Types.ObjectId.isValid(res.body.user.id)) throw new Error('Invalid object id')
      const user = await User.findById(res.body.user.id)
      if (user === null) throw new Error('User not found')

      expect(res.body.user.id).to.equal(user._id.toString())
      expect(user.password).to.not.equal(userPayload.password)
      expect(res.body.user.name).to.equal(user.name)
    })

    it('should return 400 if email is invalid', async () => {
      const req = request(app)
      const res = await req.post('/auth/sign-up')
        .set('Content-Type', 'application/json')
        .send(invalidEmailUserPayload)

      expect(res.status).to.equal(400)
      expect(res.body).to.have.property('errors')
    })

    it('should return 400 if email already exists', async () => {
      await createUser(userPayload)
      const req = request(app)
      const res = await req.post('/auth/sign-up')
        .set('Content-Type', 'application/json')
        .send(userPayload)

      expect(res.status).to.equal(400)
      expect(res.body).to.have.property('errors')
    })
  })

  describe('POST /auth/sign-in', () => {
    before(async () => {
      await createUser(userPayload)
    })

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

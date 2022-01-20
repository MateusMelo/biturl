import request from 'supertest'
import { expect } from 'chai'
import mongoose from 'mongoose'
import app from './../../../src/app'
import { User } from './../../../src/models/User'
import { UserToken } from './../../../src/models/UserToken'
import { createUser, userPayload } from './../../mocks/user.mock'

let authToken = ''
describe('routes/url', () => {
  before(async () => {
    await mongoose.connect('mongodb://localhost:27017/biturl-test')
      .catch(err => console.log(err))

    await User.deleteMany({})
    await UserToken.deleteMany({})

    await createUser(userPayload)
    const req = request(app)
    const res = await req.post('/auth/sign-in')
      .set('Content-Type', 'application/json')
      .send({
        email: userPayload.email,
        password: userPayload.password
      })
    authToken = res.body.token
  })

  after(async () => {
    await User.deleteMany({})
    await UserToken.deleteMany({})
  })

  describe('GET /urls', () => {
    it('should return urls', async () => {
      const req = request(app)
      const res = await req.get('/urls')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${authToken}`)

      expect(res.status).to.equal(200)
      expect(res.body).to.have.property('urls')
      expect(res.body.urls).to.be.a('array')
    })

    it('should return 401 when auth token is missing', async () => {
      const req = request(app)
      const res = await req.get('/urls')
        .set('Content-Type', 'application/json')

      expect(res.status).to.equal(401)
    })
  })

  describe('POST /urls', () => {
    it('should return 201 and save url', async () => {
      const req = request(app)
      const res = await req.post('/urls')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          url: 'https://biturl/qwer'
        })

      expect(res.status).to.equal(201)
      expect(res.body).to.have.property('url')
      expect(res.body.url).to.have.property('id')
      expect(res.body.url.url).to.equal('https://biturl/qwer')
    })

    it('should return 401 when auth token is missing', async () => {
      const req = request(app)
      const res = await req.post('/urls')
        .set('Content-Type', 'application/json')
        .send({
          url: 'https://biturl/qwer'
        })

      expect(res.status).to.equal(401)
    })
  })
})

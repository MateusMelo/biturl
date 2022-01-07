import request from 'supertest'
import { expect } from 'chai'
import mongoose from 'mongoose'
import app from './../../../src/app'
import { createUser, removeUser, userPayload } from './../../mocks/user.mock'

let authToken = ''

before(async () => {
  await mongoose.connect('mongodb://localhost:27017/biturl')
    .catch(err => console.log(err))

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

describe('routes/url', () => {
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

    it('should return 401 when missing auth token', async () => {
      const req = request(app)
      const res = await req.get('/urls')
        .set('Content-Type', 'application/json')

      expect(res.status).to.equal(401)
    })
  })

  after(async () => {
    await removeUser(userPayload)
  })
})

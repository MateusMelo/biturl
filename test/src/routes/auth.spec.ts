import request from 'supertest'
import { expect } from 'chai'
import app from './../../../src/app'

describe('routes/auth', () => {
  it('should auth with email and password', async () => {
    const req = request(app)
    const res = await req.post('/auth')
      .set('Content-Type', 'application/json')
      .send({
        email: 'test@test.com',
        password: '123'
      })

    expect(res.status).to.equal(200)
    expect(res.body).to.have.property('token')
    expect(res.body.token).to.be.a('string')
  })

  it('should return 400 if email is missing', async () => {
    const req = request(app)
    const res = await req.post('/auth')
      .set('Content-Type', 'application/json')
      .send({
        password: 'test@test.com'
      })

    expect(res.status).to.equal(400)
    expect(res.body).to.have.property('errors')
  })

  it('should return 400 if password is missing', async () => {
    const req = request(app)
    const res = await req.post('/auth')
      .set('Content-Type', 'application/json')
      .send({
        email: 'test@test.com'
      })

    expect(res.status).to.equal(400)
    expect(res.body).to.have.property('errors')
  })
})

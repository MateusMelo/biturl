import request from 'supertest'
import { expect } from 'chai'
import app from './../../../src/app'

let authToken = ''

before(async () => {
  const req = request(app)
  const res = await req.post('/auth')
    .set('Content-Type', 'application/json')
    .send({
      email: 'test@test.com',
      password: '123'
    })

  authToken = res.body.token
})

describe('routes/url', () => {
  it('should return urls', async () => {
    const req = request(app)
    const res = await req.get('/urls')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)

    expect(res.status).to.equal(200)
    expect(res.body).to.have.property('urls')
    expect(res.body.urls).to.be.a('array')
  })
})

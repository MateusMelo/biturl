import request from 'supertest'
import { expect } from 'chai'
import app from './../../src/app'

describe('GET /random-url', () => {
  it('should return 404', async () => {
    const req = request(app)
    const res = await req.get('/random-url')
    expect(res.status).to.equal(404)
  })
})

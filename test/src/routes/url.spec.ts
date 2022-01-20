import request from 'supertest'
import { expect } from 'chai'
import { connect, Types } from 'mongoose'
import app from './../../../src/app'
import { User } from './../../../src/models/User'
import { UserToken } from './../../../src/models/UserToken'
import { Url } from './../../../src/models/Url'
import { createUser, userPayload } from './../../mocks/user.mock'
import { createUrl, urlPayload, invalidUrlPayload } from './../../mocks/url.mock'

let authToken = ''
describe('routes/url', () => {
  before(async () => {
    await connect('mongodb://localhost:27017/biturl-test')
      .catch(err => console.log(err))

    await User.deleteMany({})
    await UserToken.deleteMany({})
    await Url.deleteMany({})

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
    await Url.deleteMany({})
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
          url: urlPayload.url
        })

      expect(res.status).to.equal(201)
      if (!Types.ObjectId.isValid(res.body.url.id)) throw new Error('Invalid object id')
      const url = await Url.findById(res.body.url.id)
      if (url === null) throw new Error('Url not found')
      expect(res.body).to.have.property('url')
      expect(res.body.url).to.have.property('id')
      expect(res.body.url.id).to.equal(url._id.toString())
      expect(res.body.url.url).to.equal(url.url)
    })

    it('should return 400 if url is invalid', async () => {
      const req = request(app)
      const res = await req.post('/urls')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          url: invalidUrlPayload.url
        })

      expect(res.status).to.equal(400)
    })

    it('should return 401 when auth token is missing', async () => {
      const req = request(app)
      const res = await req.post('/urls')
        .set('Content-Type', 'application/json')
        .send({
          url: urlPayload.url
        })

      expect(res.status).to.equal(401)
    })
  })

  describe('GET /urls/:id', () => {
    it('should return 200 and return url detail', async () => {
      const newUrl = await createUrl(urlPayload)
      const req = request(app)
      const res = await req.get(`/urls/${newUrl._id as string}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${authToken}`)

      expect(res.status).to.equal(200)
      expect(res.body).to.have.property('url')
      expect(res.body).to.deep.equal({
        url: {
          id: newUrl.id,
          url: newUrl.url,
          finalUrl: newUrl.finalUrl,
          tag: newUrl.tag
        }
      })
    })

    it('should return 200 and return empty when id is invalid', async () => {
      const req = request(app)
      const res = await req.get(`/urls/${123}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${authToken}`)

      expect(res.status).to.equal(200)
      expect(res.body).to.deep.equal({ url: {} })
    })

    it('should return 401 when auth token is missing', async () => {
      const newUrl = await createUrl(urlPayload)
      const req = request(app)
      const res = await req.get(`/urls/${newUrl._id as string}`)
        .set('Content-Type', 'application/json')

      expect(res.status).to.equal(401)
    })
  })
})

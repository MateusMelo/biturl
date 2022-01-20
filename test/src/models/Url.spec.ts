import { connect } from 'mongoose'
import { expect } from 'chai'
import { Url } from './../../../src/models/Url'
import { urlPayload } from './../../mocks/url.mock'

describe('Url model', () => {
  before(async () => {
    await connect('mongodb://localhost:27017/biturl-test')
      .catch(err => console.log(err))
  })

  after(async () => {
    await Url.deleteMany({})
  })

  it('should save url in mongodb', async () => {
    const url = new Url(urlPayload)
    await url.save()

    expect(url.url).to.be.equal(urlPayload.url)
  })
})

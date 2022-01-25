import { connect } from 'mongoose'
import { expect } from 'chai'
import config from './../../../src/config/config'
import { Url } from './../../../src/models/Url'
import { urlPayload } from './../../mocks/url.mock'

describe('Url model', () => {
  before(async () => {
    await connect(`mongodb://${config.mongodb.host as string}:${config.mongodb.port as string}/${config.mongodb.db as string}`)
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

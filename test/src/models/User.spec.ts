import { connect } from 'mongoose'
import { expect } from 'chai'
import config from './../../../src/config/config'
import { User } from './../../../src/models/User'
import { userPayload } from './../../mocks/user.mock'

describe('User model', () => {
  before(async () => {
    await connect(`mongodb://${config.mongodb.host as string}:${config.mongodb.port as string}/${config.mongodb.db as string}`)
      .catch(err => console.log(err))
  })

  after(async () => {
    await User.deleteMany({})
  })

  it('should save user in mongodb', async () => {
    const user = new User(userPayload)
    await user.save()

    expect(user.name).to.be.equal(userPayload.name)
  })
})

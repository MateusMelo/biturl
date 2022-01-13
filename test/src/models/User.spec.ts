import { connect } from 'mongoose'
import { expect } from 'chai'
import { User } from './../../../src/models/User'
import { userPayload, removeUser } from './../../mocks/user.mock'

describe('User model', () => {
  before(async () => {
    await connect('mongodb://localhost:27017/biturl')
      .catch(err => console.log(err))
  })

  after(async () => {
    await removeUser(userPayload)
  })

  it('should save user in mongodb', async () => {
    const user = new User(userPayload)
    await user.save()

    expect(user.name).to.be.equal(userPayload.name)
  })
})

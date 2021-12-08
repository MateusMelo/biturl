import { connect, disconnect } from 'mongoose'
import { expect } from 'chai'
import User from './../../../src/models/User'

const userPayload = {
  name: 'test',
  email: 'test@test.com',
  password: 'test'
}

before(async () => {
  await connect('mongodb://localhost:27017/biturl')
    .catch(err => console.log(err))
})

describe('User model', () => {
  it('should save user in mongodb', async () => {
    const user = new User(userPayload)
    await user.save()

    expect(user.name).to.be.equal(userPayload.name)
  })
})

after(async () => {
  await disconnect()
})

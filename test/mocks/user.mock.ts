import { User, UserProps } from '../../src/models/User'

export const userPayload = {
  name: 'test',
  email: 'test@test.com',
  password: 'test'
}

export const invalidEmailUserPayload = {
  name: 'test',
  email: 'invalidEmail',
  password: 'test'
}

export async function createUser (user: UserProps): Promise<void> {
  await User.create(user)
}

export async function removeUser (user: UserProps): Promise<void> {
  await User.deleteOne({ name: user.name, email: user.email })
}

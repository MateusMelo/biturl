import { Schema, Document, model } from 'mongoose'
import bcrypt from 'bcrypt'

export interface User extends Document {
  name: string
  email: string
  password: string
}

const UserSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
})

UserSchema.pre<User>('save', async function (next) {
  if (!this.isModified('password')) next()
  this.password = await bcrypt.hash(this.password, 10)
})

export default model<User>('User', UserSchema)

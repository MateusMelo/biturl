import { model, Schema, Model, Document } from 'mongoose';
import bcrypt from 'bcrypt'
export interface UserProps {
  name: string
  email: string
  password: string
}

export interface UserDocument extends UserProps, Document {}
export interface UserModel extends Model<UserDocument> {}

const UserSchema: Schema = new Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String }
}, {
  toJSON: {
    transform: (document, ret) => {
      ret.id = document._id
      delete ret._id
      delete ret.password
      delete ret.__v
    }
  }
})

UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) next()
  this.password = await bcrypt.hash(this.password, 10)
})

export const User: UserModel = model<UserDocument, UserModel>('User', UserSchema)

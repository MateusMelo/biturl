import { model, Schema, Model, Document, Types } from 'mongoose'
export interface UserTokenProps {
  token: string
  user: Types.ObjectId
  status: boolean
  expiresAt: Date
}

export interface UserTokenDocument extends UserTokenProps, Document {}
export interface UserTokenModel extends Model<UserTokenDocument> {}

const UserTokenSchema: Schema<UserTokenDocument> = new Schema({
  token: { type: String },
  user: { type: 'ObjectId', ref: 'User' },
  status: { type: Boolean, default: true },
  expiresAt: { type: Date }
}, {
  toJSON: {
    transform: (document, ret) => {
      ret.id = document._id
      delete ret._id
      delete ret.__v
    }
  }
})

export const UserToken: UserTokenModel = model<UserTokenDocument, UserTokenModel>('UserToken', UserTokenSchema)

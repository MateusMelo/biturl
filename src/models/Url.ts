import { model, Schema, Model, Document } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface UrlProps {
  url: string
}

export interface UrlDocument extends UrlProps, Document {
  tag: string
  finalUrl: string
  clicks: number
}
export interface UrlModel extends Model<UrlDocument> {}

const UrlSchema: Schema<UrlDocument> = new Schema({
  tag: { type: String },
  url: { type: String },
  finalUrl: { type: String },
  clicks: { type: Number }
}, {
  toJSON: {
    transform: (document, ret) => {
      ret.id = document._id
      delete ret._id
      delete ret.__v
    }
  }
})

UrlSchema.pre<UrlDocument>('save', async function (next) {
  if (!this.isModified('url')) next()
  const tag: string = uuidv4()
  this.tag = tag
  this.finalUrl = `https://biturl.com/${tag}`
})

export const Url: UrlModel = model<UrlDocument, UrlModel>('Url', UrlSchema)

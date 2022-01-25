import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(__dirname, '../../.env') })

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongodb: {
    host: process.env.MONGODB_HOST,
    port: process.env.MONGODB_PORT,
    db: process.env.NODE_ENV === 'test' ? `${process.env.MONGODB_DATABASE as string}-test` : process.env.MONGODB_DATABASE
  },
  jwt: {
    secret: process.env.JWT_SECRET
  }
}

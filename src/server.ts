import { connect } from 'mongoose'
import config from './../src/config/config'
import app from './app'

let server
connect(`mongodb://${config.mongodb.host as string}:${config.mongodb.port as string}/${config.mongodb.db as string}`)
  .then(() => {
    console.log('Connected to MongoDB')
    server = app.listen(config.port, () => {
      console.log('App is running at http://localhost:%d', config.port)
    })
  }).catch(err => console.log(err))

export default server

import { connect } from 'mongoose'
import app from './app'

let server
connect('mongodb://localhost:27017/biturl')
  .then(() => {
    console.log('Connected to MongoDB')
    server = app.listen(5000, () => {
      console.log('App is running at http://localhost:%d', 5000)
    })
  }).catch(err => console.log(err))

export default server

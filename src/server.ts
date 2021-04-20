import app from './app'

const server = app.listen(5000, () => {
  console.log('App is running at http://localhost:%d', 5000)
})

export default server

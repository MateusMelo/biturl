import express, { Express } from 'express'
import helmet from 'helmet'
import dotenv from 'dotenv'

import { checkJwt } from './middlewares/auth'
import authRouter from './routes/auth'
import urlRouter from './routes/url'

const app: Express = express()

dotenv.config()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(helmet())

app.use('/auth', authRouter)

app.use(checkJwt)
app.use('/urls', urlRouter)

export default app

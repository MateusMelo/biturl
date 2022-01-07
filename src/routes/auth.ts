import { Request, Response, Router } from 'express'
import { body, validationResult, CustomValidator } from 'express-validator'
import jwt, { Secret } from 'jsonwebtoken'
import dayjs from 'dayjs'
import { User } from './../models/User'
import { UserToken } from './../models/UserToken'

interface SignInBody {
  email: string
  password: string
  rememberMe: boolean
}

const isValidUser: CustomValidator = async value => {
  const user = await User.findOne({ email: value })
  if (user === null) {
    throw new Error('Incorrect email or password')
  }
}

const emailExists: CustomValidator = async value => {
  const user = await User.emailAlreadyExists(value)
  if (user !== null) {
    throw new Error('Email already exists')
  }
}

const router = Router()

router.post('/sign-in',
  body('email').not().isEmpty().isEmail(),
  body('password').not().isEmpty(),
  body('email').custom(isValidUser),
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const body: SignInBody = req.body
    const user = await User.findOne({ email: body.email })
    const token: string = jwt.sign({ email: body.email }, process.env.JWT_SECRET as Secret, { expiresIn: '1800s' })

    return res.json({ user, token })
  })

router.post('/sign-up',
  body('name').not().isEmpty(),
  body('email').not().isEmpty().isEmail(),
  body('password').not().isEmpty(),
  body('email').custom(emailExists),
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })
    await user.save()

    const expiresAt = dayjs().add(10, 'minute')
    const token: string = jwt.sign({
      user: user.id,
      exp: expiresAt.unix()
    }, process.env.JWT_SECRET as Secret)
    const userToken = new UserToken({
      token,
      user: user.id,
      expiresAt: expiresAt.toDate()
    })
    await userToken.save()

    return res.status(201).json({ user, token: { access: userToken.token, expiresAt: userToken.expiresAt } })
  })

export default router

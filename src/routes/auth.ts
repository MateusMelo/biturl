import { Request, Response, Router } from 'express'
import { body, validationResult, CustomValidator } from 'express-validator'
import jwt, { Secret } from 'jsonwebtoken'
import { User } from './../models/User'
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
    const token: string = jwt.sign({ email: body.email }, process.env.JWT_SECRET as Secret, { expiresIn: '1800s' })
    const user = await User.findOne({ email: body.email })

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

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email
    })
  })

export default router

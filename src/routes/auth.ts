import { Request, Response, Router } from 'express'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'

interface SignInBody {
  email: string
  password: string
  rememberMe: boolean
}

const router = Router()

router.post('/',
  body('email').not().isEmpty().isEmail(),
  body('password').not().isEmpty(),
  (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const body: SignInBody = req.body

    const token: string = jwt.sign({ email: body.email }, '123', { expiresIn: '1800s' })

    return res.json({ token })
  })

router.post('/sign-up',
  body('email').not().isEmpty().isEmail(),
  body('password').not().isEmpty(),
  (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    return res.json({
      token: '123'
    })
  })

export default router

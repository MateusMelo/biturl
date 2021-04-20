import { Request, Response, Router } from 'express'
import { body, validationResult } from 'express-validator'

const router = Router()

router.post('/',
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

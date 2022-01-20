import { Request, Response, Router } from 'express'
import { Url } from './../../src/models/Url'
import { body, validationResult } from 'express-validator'

const router = Router()

router.get('/', (req: Request, res: Response) => {
  return res.json({
    urls: []
  })
})

router.post('/',
  body('url').not().isEmpty().isURL(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const url = new Url({
      url: req.body.url
    })
    await url.save()

    return res.status(201).json({
      url
    })
  })

router.get('/:id', async (req: Request, res: Response) => {
  let url
  try {
    url = await Url.findById(req.params.id)
    if (url === null) {
      url = {}
    }
  } catch (e) {
    url = {}
  }

  return res.status(200).json({
    url
  })
})

export default router

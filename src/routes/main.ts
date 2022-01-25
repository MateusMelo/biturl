import { Request, Response, Router } from 'express'
import { Url } from './../../src/models/Url'

const router = Router()

router.get('/:tag', async (req: Request, res: Response) => {
  let url
  try {
    url = await Url.findOne({ tag: req.params.tag })
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

import { Request, Response, Router } from 'express'

const router = Router()

router.get('/', (req: Request, res: Response) => {
  return res.json({
    urls: []
  })
})

router.post('/', (req: Request, res: Response) => {
  return res.status(201).json({
    url: {
      id: '123',
      slug: 'qwer',
      url: 'https://biturl/qwer'
    }
  })
})

export default router

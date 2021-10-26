import { NextFunction, Request, Response } from 'express'
import jwt, { Secret } from 'jsonwebtoken'

export interface AuthorizedRequest extends Request {
  user: string
}

export async function checkJwt (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader: string = req.headers.authorization ?? ''
  const token: string = authHeader.split('Bearer ').pop() ?? ''

  if (token !== '') {
    try {
      await jwt.verify(token, process.env.JWT_SECRET as Secret)
    } catch (e) {
      console.error(e)
      res.sendStatus(401)
    }

    next()
  }

  res.sendStatus(401)
}

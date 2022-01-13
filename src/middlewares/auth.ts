import { NextFunction, Request, Response } from 'express'
import jwt, { Secret, JwtPayload } from 'jsonwebtoken'
import { UserToken } from './../models/UserToken'

export interface AuthorizedRequest extends Request {
  user: string
}
export interface MyJwtPayload extends JwtPayload {
  user: string
}

export async function checkJwt (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader: string = req.headers.authorization ?? ''
  const token: string = authHeader.split('Bearer ').pop() ?? ''

  if (token === '') {
    res.sendStatus(401)
    return
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as Secret) as MyJwtPayload
    const userToken = await UserToken.findOne({ token, user: payload.user, status: true })
    if (userToken === null) {
      throw new Error('UserToken not found')
    }
  } catch (e) {
    console.error(e)
    res.sendStatus(401)
    return
  }

  next()
}

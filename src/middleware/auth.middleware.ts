import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export interface AuthenticatedRequest extends Request {
  userId?: string
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  // if (req.path === '/auth/register' || req.path === '/auth/login') {
  //   next() // Skip authentication for register and login routes
  //   return
  // }
  const authHeader = req.headers.authorization
  if (!authHeader) {
    res.status(401).json({ error: 'Missing token' })
    return
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    req.userId = decoded.userId
    next()
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

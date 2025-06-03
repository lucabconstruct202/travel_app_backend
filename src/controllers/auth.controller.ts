import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../services/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' })
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)
  try {
    const user = await prisma.user.create({ data: { email, passwordHash } })
    res.status(201).json({ id: user.id, email: user.email })
  } catch {
    res.status(400).json({ error: 'User already exists or invalid data' })
  }
}

export const login = async (req: Request, res: Response):Promise<void> => {
  const { email, password } = req.body
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }
  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' })
  res.json({ token })
}

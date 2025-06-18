import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../services/prisma'
import { AuthenticatedRequest } from '../middleware/auth.middleware'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export const register = async (req: Request, res: Response): Promise<void> => {
  console.log('Registering user...')
  const { email, password, firstName, lastName } = req.body
  if (!email || !password || !firstName || !lastName) {
    res.status(400).json({ error: 'Email, password, first name, and last name are required' })
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)
  try {
    const user = await prisma.user.create({ data: {
      email,
      passwordHash,
      firstName,
      lastName
    } })
    res.status(201).json({       
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName })
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

export const getUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> =>{
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { firstName: true, lastName: true, email: true }
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

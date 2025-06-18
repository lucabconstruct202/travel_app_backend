import { Router } from 'express'
import { register, login, getUserProfile } from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/profile', authenticate, getUserProfile)

export default router

import { Router } from 'express'
import { getUserElements, createElementFromPlace  } from '../controllers/element.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.get('/elements', authenticate, getUserElements)
router.post('/elements/from-place', authenticate, createElementFromPlace)

export default router

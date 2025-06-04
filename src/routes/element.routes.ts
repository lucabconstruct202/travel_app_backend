import { Router } from 'express'
import { getUserElements, createElementFromPlace, updateElement, deleteElement  } from '../controllers/element.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.get('/elements', authenticate, getUserElements)
router.post('/elements/from-place', authenticate, createElementFromPlace)
router.patch('/elements/:id', authenticate, updateElement)
router.delete('/elements/:id', authenticate, deleteElement)

export default router

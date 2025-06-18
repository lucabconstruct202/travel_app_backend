import { Router } from 'express'
import {
  createGroup,
  updateGroup,
  deleteGroup,
  addElementToGroup,
  removeElementFromGroup,
  getUserGroups
} from '../controllers/group.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

// Authenticated routes
router.use(authenticate)

router.post('/groups', authenticate, createGroup)
router.put('/groups/:id', authenticate, updateGroup)
router.delete('/groups/:id', authenticate, deleteGroup)

router.post('/groups/add-element', authenticate, addElementToGroup)
router.post('/groups/remove-element', authenticate, removeElementFromGroup)

router.get('/groups', authenticate, getUserGroups)

export default router

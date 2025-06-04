import { Router } from 'express'
import {
  addNote,
  deleteNote,
  updateNote,
  addRating,
  updateRating,
  addTag,
  deleteTag,
  updateTag,
  getUserTags,
  deleteRating
} from '../controllers/elementExtras.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

// Notes
router.post('/elements/:id/notes', authenticate, addNote)
router.delete('/notes/:id', authenticate, deleteNote)
router.patch('/notes/:id', authenticate, updateNote)

// Ratings
router.post('/elements/:id/ratings', authenticate, addRating)
router.patch('/ratings/:id', authenticate, updateRating)
router.delete('/ratings/:id', authenticate, deleteRating)

// Tags
router.post('/elements/:id/tags', authenticate, addTag)
router.delete('/tags/:elementId/:tagId', authenticate, deleteTag)
router.patch('/tags/:id', authenticate, updateTag)
router.get('/tags', authenticate, getUserTags)

export default router
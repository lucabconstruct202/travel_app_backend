// src/routes/program.routes.ts
import express from 'express'
import {
  createProgram,
  updateProgram,
  deleteProgram,
  getUserPrograms,
  createProgramTimerange,
  updateProgramTimerange,
  deleteProgramTimerange,
  addGroupToTimerange,
  removeGroupFromTimerange,
} from '../controllers/program.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = express.Router()

// Program routes
router.post('/programs', authenticate, createProgram)
router.put('/programs/:id', authenticate, updateProgram)
router.delete('/programs/:id', authenticate, deleteProgram)
router.get('/programs', authenticate, getUserPrograms)

// ProgramTimerange routes
router.post('/programs/:programId/timeranges', authenticate, createProgramTimerange)
router.put('/programs/timerange/:id', authenticate, updateProgramTimerange)
router.delete('/programs/timerange/:id', authenticate, deleteProgramTimerange)

// Group <-> Timerange links
router.post('/programs/timerange/:id/groups', authenticate, addGroupToTimerange)
router.delete('/programs/timerange/:id/groups/:groupId', authenticate, removeGroupFromTimerange)

export default router

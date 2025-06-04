import { Router } from 'express'
import { addPhoto, deletePhoto } from '../controllers/photo.controller'
import { upload } from '../middleware/upload.middleware'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.post('/elements/:id/photos', authenticate, upload.single('photo'), addPhoto)
router.delete('/photos/:id', authenticate, deletePhoto)

export default router

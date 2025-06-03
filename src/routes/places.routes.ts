// src/routes/places.routes.ts
import { Router } from 'express'
import { autocompletePlaces, placeDetails } from '../controllers/places.controller'

const router = Router()

router.get('/places/autocomplete', autocompletePlaces)
router.get('/places/details', placeDetails)

export default router

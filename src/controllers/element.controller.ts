import { Request, Response } from 'express'
import axios from 'axios'
import prisma from '../services/prisma'
import { AuthenticatedRequest } from '../middleware/auth.middleware'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { deleteFromS3 } from '../services/s3.service'

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY

interface GooglePlaceDetailsResponse {
  result: {
      name: string
      formatted_address: string
      address_components: string[]
      types: string[]
      geometry: {
      location: {
          lat: number
          lng: number
      }
      }
      international_phone_number?: string
      website?: string
      url?: string
  }
  status: string
}

function extractAddressInfo(components: any[]) {
  const get = (type: string) =>
    components.find((c) => c.types.includes(type))?.long_name || null

  return {
    street: [get('route'), get('street_number')].filter(Boolean).join(' ') || null,
    city: get('locality'),
    country: get('country')
  }
}

export const createElementFromPlace = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const {
    place_id,
    category,
    visited = false,
    visitDate,
    selectedRating,
    notes = [],
    photos = [],
    tags = []
  } = req.body
  console.log(req.userId)
  console.log(req.body)
  if (!place_id || !category) {
    res.status(400).json({ error: 'Missing place_id or category' })
    return
  }

  try {
    const response = await axios.get<GooglePlaceDetailsResponse>('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id,
        key: GOOGLE_API_KEY,
        language: 'de',
        fields: 'name,geometry,formatted_address,address_components,types,url,website'
      }
    })

    const result = response.data.result
    const { lat, lng } = result.geometry.location
    const address = extractAddressInfo(result.address_components)

    const element = await prisma.element.create({
      data: {
        name: result.name,
        category,
        location: result.formatted_address,
        street: address.street,
        city: address.city,
        country: address.country,
        googleMapId: place_id,
        lat,
        lng,
        visited,
        visitDate: visitDate ? new Date(visitDate) : undefined,
        userId: req.userId!,
        // Nested creation:
        ratings: selectedRating !== null
        ? {
            create: {
              rating:selectedRating,
              googleMapId: place_id,
              user: {
                connect: { id: req.userId! }
              }
            }
          }
        : undefined,
        notes: notes.length
          ? {
              create: notes.map((n: string) => ({
                content: n,
                userId: req.userId
              }))
            }
          : undefined,
        tags: tags.length
          ? {
              create: tags.map((t: any) => ({
                tag: {
                  connectOrCreate: {
                    where: { name: t.tag.name },
                    create: { name: t.tag.name }
                  }
                }
              }))
            }
          : undefined
      }
    })


    res.status(201).json(element)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create element from place_id' })
  }
}


export const getUserElements = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (!req.userId) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  try {
    const elements = await prisma.element.findMany({
      where: { userId: req.userId },
      include: {
        ratings: true,
        notes: true,
        photos: true,
        tags: {
          include: {
            tag: true // ← Tag-Namen mitladen
          }
        }
      }
    })

    res.json(elements)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch elements' })
  }
}

export const updateElement = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params
  const {
    name,
    description,
    category,
    visited,
    visitDate,
    location,
    city,
    country,
    street,
    lat,
    lng
  } = req.body

  console.log('Updating element:', id, req.body)
  const visiting = visitDate ? new Date(visitDate) : null
  console.log('Visiting date:', visiting)
  try {
    const element = await prisma.element.updateMany({
      where: {
        id,
        userId: req.userId
      },
      data: {
        name,
        description,
        category,
        visited,
        visitDate: visitDate ? new Date(visitDate) : null,
        location,
        city,
        country,
        street,
        lat,
        lng
      }
    })

    if (element.count === 0) {
      res.status(404).json({ error: 'Element not found or not authorized' })
      return
    }

    res.json({ message: 'Element updated successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update element' })
  }
}

export const deleteElement = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params

  try {
    // 1. Element holen inkl. Fotos
    const element = await prisma.element.findUnique({
      where: { id },
      include: { photos: true },
    })

    if (!element || element.userId !== req.userId) {
      res.status(404).json({ error: 'Element not found or not authorized' })
      return
    }

    // 2. S3-Fotos löschen (nur wenn sie in unserem Bucket liegen)
    for (const photo of element.photos) {
      const key = photo.fileUrl.split('digitaloceanspaces.com/')[1]
      await deleteFromS3(key)
    }

    // 3. Element aus der DB löschen (Cascade handled the rest)
    await prisma.element.delete({ where: { id } })

    res.json({ message: 'Element and related data deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete element' })
  }
}


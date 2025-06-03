// src/controllers/places.controller.ts
import axios from 'axios'
import { Request, Response } from 'express'

interface GoogleAutocompleteResponse {
    predictions: {
      place_id: string
      description: string
    }[]
    status: string
}
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

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY

export const autocompletePlaces = async (req: Request, res: Response): Promise<void> => {
  const { input } = req.query

  if (!input || typeof input !== 'string') {
    res.status(400).json({ error: 'Missing input query' })
    return
  }

  try {
    const response = await axios.get<GoogleAutocompleteResponse>('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
      params: {
        input,
        key: GOOGLE_API_KEY,
        language: 'de',
      }
    })
    console.log(response.data)

    res.json(response.data.predictions.map((p: any) => ({
      place_id: p.place_id,
      description: p.description
    })))
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch suggestions' })
  }
}

export const placeDetails = async (req: Request, res: Response): Promise<void> => {
    const { place_id } = req.query
  
    if (!place_id || typeof place_id !== 'string') {
      res.status(400).json({ error: 'Missing place_id' })
      return
    }
  
    try {
      const response = await axios.get<GooglePlaceDetailsResponse>('https://maps.googleapis.com/maps/api/place/details/json', {
        params: {
          place_id,
          key: GOOGLE_API_KEY,
          language: 'de',
          fields: 'name,geometry,formatted_address,address_components,types,photos,url,international_phone_number,website'
        }
      })
  
      const result = response.data.result
      const { lat, lng } = result.geometry.location
      const addressInfo = extractAddressInfo(result.address_components)
  
      res.json({
        name: result.name,
        lat,
        lng,
        street: addressInfo.street,
        city: addressInfo.city,
        country: addressInfo.country,
        address: result.formatted_address,
        types: result.types,
        location: result.geometry.location,
        phone: result.international_phone_number,
        website: result.website,
        google_url: result.url
      })
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch place details' })
    }
  }

  function extractAddressInfo(components: any[]) {
    const get = (type: string) => components.find(c => c.types.includes(type))?.long_name || null
  
    return {
      street: [get('route'), get('street_number')].filter(Boolean).join(' '),
      city: get('locality'),
      country: get('country')
    }
  }

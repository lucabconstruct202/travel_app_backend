import { Request, Response } from 'express'
import { uploadToS3, deleteFromS3 } from '../services/s3.service'
import prisma from '../services/prisma'
import { AuthenticatedRequest } from '../middleware/auth.middleware'

export const addPhoto = async (req: Request, res: Response):Promise<void> => {
  const { id: elementId } = req.params
  if (!req.file) {
    res.status(400).json({ error: 'No file provided' })
    return 
  }

  const fileUrl = await uploadToS3(req.file)

  const photo = await prisma.photo.create({
    data: {
      fileUrl,
      elementId
    }
  })

  res.status(201).json(photo)
}

export const deletePhoto = async (req: Request, res: Response):Promise<void> => {
  const { id } = req.params
  const photo = await prisma.photo.findUnique({ where: { id } })
  if (!photo){
    res.status(404).json({ error: 'Photo not found' })
    return
  } 

  const key = photo.fileUrl.split('digitaloceanspaces.com/')[1]
  await deleteFromS3(key)
  await prisma.photo.delete({ where: { id } })

  res.status(200).json({ message: 'Photo deleted' })
}

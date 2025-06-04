import { Request, Response } from 'express'
import prisma from '../services/prisma'
import { AuthenticatedRequest } from '../middleware/auth.middleware'

export const addNote = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { content } = req.body
    const note = await prisma.note.create({
      data: {
        content,
        elementId: req.params.id,
        userId: req.userId!
      }
    })
    res.status(201).json(note)
  } catch (err) {
    res.status(500).json({ error: 'Failed to add note' })
  }
}

export const deleteNote = async (req: AuthenticatedRequest, res: Response) => {
  try {
    await prisma.note.delete({ where: { id: req.params.id } })
    res.status(204).end()
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' })
  }
}

export const updateNote = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const note = await prisma.note.update({
      where: { id: req.params.id },
      data: { content: req.body.content }
    })
    res.json(note)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update note' })
  }
}

export const addRating = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { rating } = req.body
    const newRating = await prisma.rating.create({
      data: {
        rating,
        elementId: req.params.id,
        userId: req.userId!
      }
    })
    res.status(201).json(newRating)
  } catch (err) {
    res.status(500).json({ error: 'Failed to add rating' })
  }
}

export const updateRating = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const rating = await prisma.rating.update({
      where: { id: req.params.id },
      data: { rating: req.body.rating }
    })
    res.json(rating)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update rating' })
  }
}

export const deleteRating = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params
  
    try {
      await prisma.rating.delete({
        where: {
          id
        }
      })
      res.status(204).send()
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to delete rating' })
    }
  }

export const addTag = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name } = req.body
    let tag = await prisma.tag.findUnique({ where: { name } })
    if (!tag) {
      tag = await prisma.tag.create({ data: { name } })
    }
    const elementTag = await prisma.elementTag.create({
      data: {
        elementId: req.params.id,
        tagId: tag.id
      }
    })
    res.status(201).json(elementTag)
  } catch (err) {
    res.status(500).json({ error: 'Failed to add tag' })
  }
}

export const deleteTag = async (req: AuthenticatedRequest, res: Response) => {
    const { elementId, tagId } = req.params
  
    try {
      await prisma.elementTag.delete({
        where: {
          elementId_tagId: {
            elementId,
            tagId,
          },
        },
      })
  
      res.status(200).json({ message: 'Tag removed from element' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to remove tag from element' })
    }
  }

export const updateTag = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tag = await prisma.tag.update({
      where: { id: req.params.id },
      data: { name: req.body.name }
    })
    res.json(tag)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update tag' })
  }
}

export const getUserTags = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tags = await prisma.tag.findMany({
      where: {
        elements: {
          some: {
            element: { userId: req.userId }
          }
        }
      },
      distinct: ['name']
    })
    res.json(tags)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tags' })
  }
}

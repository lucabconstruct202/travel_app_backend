import { Request, Response } from 'express'
import prisma from '../services/prisma'
import { AuthenticatedRequest } from '../middleware/auth.middleware'

export const createGroup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description } = req.body
    const group = await prisma.group.create({
      data: {
        title,
        description,
        userId: req.userId!,
      },
    })
    res.status(201).json(group)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create group' })
  }
}

export const updateGroup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description } = req.body
    const { id } = req.params

    const group = await prisma.group.update({
      where: { id },
      data: { title, description },
    })
    res.json(group)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update group' })
  }
}

export const deleteGroup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    await prisma.group.delete({ where: { id } })
    res.json({ message: 'Group deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete group' })
  }
}

export const addElementToGroup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { groupId, elementId } = req.body
    const added = await prisma.groupElement.create({
      data: {
        groupId,
        elementId,
      },
    })
    res.status(201).json(added)
  } catch (err) {
    res.status(500).json({ error: 'Failed to add element to group' })
  }
}

export const removeElementFromGroup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { groupId, elementId } = req.body
    await prisma.groupElement.delete({
      where: {
        groupId_elementId: {
          groupId,
          elementId,
        },
      },
    })
    res.json({ message: 'Element removed from group' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove element from group' })
  }
}

export const getUserGroups = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const groups = await prisma.group.findMany({
      where: { userId: req.userId },
      include: {
        elements: {
          include: {
            element: true,
          },
        },
      },
    })
    res.json(groups)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch groups' })
  }
}

// src/controllers/program.controller.ts
import { Request, Response } from 'express'
import prisma from '../services/prisma'
import { AuthenticatedRequest } from '../middleware/auth.middleware'

export const createProgram = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, startDate, endDate } = req.body
    const program = await prisma.program.create({
      data: {
        title,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        userId: req.userId!,
      },
    })
    res.status(201).json(program)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create program' })
  }
}

export const updateProgram = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const { title, description, startDate, endDate } = req.body
    const program = await prisma.program.update({
      where: { id },
      data: {
        title,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    })
    res.json(program)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update program' })
  }
}

export const deleteProgram = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    await prisma.program.delete({ where: { id } })
    res.json({ message: 'Program deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete program' })
  }
}

export const getUserPrograms = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const programs = await prisma.program.findMany({
      where: { userId: req.userId },
      include: {
        timeranges: {
          include: {
            groups: {
              include: {
                group: true,
              },
            },
          },
        },
      },
    })
    res.json(programs)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch programs' })
  }
}

export const createProgramTimerange = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { programId } = req.params
    const { startDate, endDate } = req.body
    const timerange = await prisma.programTimerange.create({
      data: {
        programId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    })
    res.status(201).json(timerange)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create program timerange' })
  }
}

export const updateProgramTimerange = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const { startDate, endDate } = req.body
    const timerange = await prisma.programTimerange.update({
      where: { id },
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    })
    res.json(timerange)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update timerange' })
  }
}

export const deleteProgramTimerange = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    await prisma.programTimerange.delete({ where: { id } })
    res.json({ message: 'Timerange deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete timerange' })
  }
}

export const addGroupToTimerange = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params // timerange ID
    const { groupId } = req.body
    const link = await prisma.programTimerangeGroup.create({
      data: {
        timerangeId: id,
        groupId,
      },
    })
    res.status(201).json(link)
  } catch (err) {
    res.status(500).json({ error: 'Failed to add group to timerange' })
  }
}

export const removeGroupFromTimerange = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id, groupId } = req.params // timerangeId and groupId
    await prisma.programTimerangeGroup.delete({
      where: {
        timerangeId_groupId: {
          timerangeId: id,
          groupId,
        },
      },
    })
    res.json({ message: 'Group removed from timerange' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove group from timerange' })
  }
}

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      passwordHash: '$2b$10$NWbTSp1dK80nV0CnE6zWreJaKg4.Bwalwg27iQvDSHZTAX1loI7mu',
    },
  })

  const program = await prisma.program.create({
    data: {
      name: 'Frankreich Reise',
      userId: user.id,
    },
  })

  const group = await prisma.group.create({
    data: {
      name: 'Tag 1 - Nizza',
      programId: program.id,
      position: 1
    },
  })

  const element = await prisma.element.create({
    data: {
      name: 'Eiffelturm',
      description: 'Wahrzeichen von Paris',
      category: 'Sehenswürdigkeit',  // gewählt vom User
      location: 'Av. Gustave Eiffel, 75007 Paris, Frankreich',
      street: 'Avenue Gustave Eiffel',
      city: 'Paris',
      country: 'Frankreich',
      lat: 48.85837009999999,
      lng: 2.2944813,
      visited: false,
      userId: user.id
    }
  })

  await prisma.groupElement.create({
    data: {
      groupId: group.id,
      elementId: element.id
    },
  })
}

main().catch(console.error).finally(() => prisma.$disconnect())

import { PrismaClient } from '@prisma/client'
import { v1 as uuidv1 } from 'uuid'

const prisma = new PrismaClient()

async function main () {
  const seedData = [
    { name: 'Spiderman', abilility: 'Spider webs' },
    { name: 'Superman', abilility: 'Flying' },
    { name: 'Hulk', abilility: 'Big green monster' },
    { name: 'Wolverine', abilility: 'Metal claws' },
    { name: 'Capitan American', abilility: 'Super soldier' },
    { name: 'Capitan Marvel', abilility: 'Powered by infinity stone' },
    { name: 'Dr. Strange', abilility: 'Can bend time' },
    { name: 'Black Widow', abilility: 'Spy' },
    { name: 'Ironman', abilility: 'Smart Suit' },
    { name: 'Deadpool', abilility: 'Cannot die' }
  ]

  const inserts = seedData.map(async (x) => {
    const user = await prisma.user.create({
      data: {
        emailAddress: `${uuidv1()}@whynotga.me`,
        password: `${x}`,
        timeShards: 100
      }
    })

    await prisma.hero.create({
      data: {
        multiverse: uuidv1(),
        name: x.name,
        userId: user.id
      }
    })

    await prisma.attribute.create({
      data: {
        name: x.abilility
      }
    })
  })

  await Promise.all(inserts)

  const [heros, attributes] = await Promise.all([
    await prisma.hero.findMany(),
    await prisma.attribute.findMany()
  ])

  const updates = heros.map(async (x) => {
    const attributeIndex = Math.floor(Math.random() * attributes.length)
    await prisma.heroAttribute.create({
      data: {
        heroId: x.id,
        attributeId: attributes[attributeIndex].id
      }
    })
    attributes.splice(attributeIndex, 1)
  })

  const levels = [1, 2, 3, 4, 5]

  const levelPromises = levels.map(async (x) => {
    await prisma.levelTiers.create({
      data: {
        level: x,
        minExperience: x === 1 ? 0 : x ** 3 * 1000
      }
    })
  })

  await Promise.all([...updates, ...levelPromises])
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { PrismaClient } from '@prisma/client'
import { v1 as uuidv1 } from 'uuid'
import bcrypt from 'bcryptjs'
import { Random } from 'random-js'

import {
  TimeShardService,
  TransactionTypeEnum
} from '../src/services/TimeShardService'

const prisma = new PrismaClient()

interface IHeroSeed {
  name: string
  ability: string
  moveNames: string[]
}

async function main() {
  const timeShardService = new TimeShardService(prisma)
  const seedData: IHeroSeed[] = [
    {
      name: 'Spiderman',
      ability: 'Spider webs',
      moveNames: ['Web shot', 'Restraint']
    },
    { name: 'Superman', ability: 'Flying', moveNames: ['Air Slam', 'Retreat'] },
    { name: 'Hulk', ability: 'Big green monster', moveNames: ['Smash'] },
    { name: 'Wolverine', ability: 'Metal claws', moveNames: ['Slice', 'Stab'] },
    {
      name: 'Capitan American',
      ability: 'Super soldier',
      moveNames: ['Super punch']
    },
    {
      name: 'Capitan Marvel',
      ability: 'Powered by infinity stone',
      moveNames: ['Power beam', 'Teleport']
    },
    { name: 'Dr. Strange', ability: 'Can bend time', moveNames: ['Reversal'] },
    { name: 'Black Widow', ability: 'Spy', moveNames: ['Invade', 'Headshot'] },
    { name: 'Ironman', ability: 'Smart Suit', moveNames: ['Rockets'] },
    { name: 'Deadpool', ability: 'Cannot die', moveNames: ['Invincible'] }
  ]

  const random = new Random()

  const inserts = seedData.map(async (x, index) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash('123', salt)

    const user = await prisma.user.create({
      data: {
        emailAddress: `${index}@whynotga.me`,
        password: hashedPassword,
        timeShards: 100
      }
    })

    await prisma.hero.create({
      data: {
        multiverse: uuidv1(),
        name: x.name,
        totalHealth: 100,
        currentHealth: 100,
        userId: user.id,
        speed: random.integer(1, 100)
      }
    })

    await prisma.attribute.create({
      data: {
        name: x.ability,
        baseDamage: random.integer(1, 100)
      }
    })

    await prisma.attribute.create({
      data: {
        name: x.ability,
        moves: {
          create: x.moveNames.map((x) => ({
            name: x
          }))
        }
      }
    })

    await timeShardService.createTransactionHistoryItem({
      userId: user.id,
      previousTimeShards: user.timeShards,
      timeShardsDelta: 0,
      transactionType: TransactionTypeEnum.testCredit,
      updatedTimeShards: user.timeShards
    })

    await timeShardService.createTransactionHistoryItem({
      userId: user.id,
      previousTimeShards: user.timeShards,
      timeShardsDelta: 0,
      transactionType: TransactionTypeEnum.testDebit,
      updatedTimeShards: user.timeShards
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
    const minXp = x ** 3 * 1000

    console.log(minXp)

    await prisma.levelTier.create({
      data: {
        level: x,
        minExperience: x === 1 ? 0 : minXp
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

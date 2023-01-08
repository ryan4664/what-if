import { PrismaClient } from '@prisma/client'
// @ts-ignore
import bcrypt from 'bcryptjs'
import { Random } from 'random-js'

import { AttributeService, ExperienceService, HeroService, TimeShardService, UserService } from '../src/services'
import { TransactionTypeEnum } from '../src/services/types'
import { LevelType } from '../src/types'

const prisma = new PrismaClient()

interface IHeroSeed {
    name: string
    ability: string
    moveNames: string[]
}

async function main() {
    const userService = new UserService(prisma)
    const timeShardService = new TimeShardService(prisma)
    const experienceService = new ExperienceService(prisma)
    const heroService = new HeroService(prisma)
    const attributeService = new AttributeService(prisma)

    const seedData: IHeroSeed[] = [
        {
            name: 'Spiderman',
            ability: 'Spider webs',
            moveNames: ['Web shot', 'Restraint'],
        },
        { name: 'Superman', ability: 'Flying', moveNames: ['Air Slam', 'Retreat'] },
        { name: 'Hulk', ability: 'Big green monster', moveNames: ['Smash'] },
        { name: 'Wolverine', ability: 'Metal claws', moveNames: ['Slice', 'Stab'] },
        {
            name: 'Capitan America',
            ability: 'Super soldier',
            moveNames: ['Super punch'],
        },
        {
            name: 'Capitan Marvel',
            ability: 'Powered by infinity stone',
            moveNames: ['Power beam', 'Teleport'],
        },
        { name: 'Dr. Strange', ability: 'Can bend time', moveNames: ['Reversal'] },
        { name: 'Black Widow', ability: 'Spy', moveNames: ['Invade', 'Headshot'] },
        { name: 'Ironman', ability: 'Smart Suit', moveNames: ['Rockets'] },
        { name: 'Deadpool', ability: 'Cannot die', moveNames: ['Invincible'] },
    ]

    const levels = [1, 2, 3, 4, 5]

    const levelPromises = levels.map(async (x) => {
        const minUserXp = x ** 3 * 10000

        await prisma.levelTier.create({
            data: {
                level: x,
                minExperience: x === 1 ? 0 : minUserXp,
                type: LevelType.User,
            },
        })

        const minHeroXp = x ** 3 * 1000

        await prisma.levelTier.create({
            data: {
                level: x,
                minExperience: x === 1 ? 0 : minHeroXp,
                type: LevelType.Hero,
            },
        })
    })

    await Promise.all([...levelPromises])

    const random = new Random()

    const inserts = seedData.map(async (x, index) => {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash('123', salt)

        const user = await userService.create({
            emailAddress: `${index}@whynotga.me`,
            password: hashedPassword,
        })

        // Credit random experience to test crediting and
        // leveling up
        await experienceService.creditUserExperience({
            userId: user.id,
            amountToCredit: random.integer(50, 15000),
        })

        await prisma.attribute.create({
            data: {
                name: x.ability,
                baseDamage: random.integer(1, 100),
            },
        })

        await prisma.attribute.create({
            data: {
                name: x.ability,
                moves: {
                    create: x.moveNames.map((x) => ({
                        name: x,
                    })),
                },
            },
        })

        await heroService.create({ name: x.name, userId: user.id })

        await timeShardService.createTransactionHistoryItem({
            userId: user.id,
            previousTimeShards: user.timeShards,
            timeShardsDelta: 0,
            transactionType: TransactionTypeEnum.credit,
            updatedTimeShards: user.timeShards,
        })

        await timeShardService.createTransactionHistoryItem({
            userId: user.id,
            previousTimeShards: user.timeShards,
            timeShardsDelta: 0,
            transactionType: TransactionTypeEnum.debit,
            updatedTimeShards: user.timeShards,
        })
    })

    await Promise.all(inserts)

    const [heros, attributes] = await Promise.all([
        await heroService.getHeros(),
        await attributeService.getAttributes(),
    ])

    const updates = heros.map(async (x) => {
        const attributeIndex = Math.floor(Math.random() * attributes.length)
        await prisma.heroAttribute.create({
            data: {
                heroId: x.id,
                attributeId: attributes[attributeIndex].id,
            },
        })
        attributes.splice(attributeIndex, 1)
    })

    await Promise.all([...updates])
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

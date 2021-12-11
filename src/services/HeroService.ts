import { Hero, Prisma, PrismaClient } from '@prisma/client'
import { v1 as uuidv1 } from 'uuid'
import { TimeShardService, TransactionTypeEnum } from './TimeShardService'
import { UserService } from './UserService'

// Store somewhere?
export const HERO_PRICE_IN_TIME_SHARDS = 100
export class HeroService {
  prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  public getHeros = async (heroIds?: string[]): Promise<any> => {
    let arg = {
      include: {
        heroAttributes: {
          include: {
            attriubute: true
          }
        }
      }
    }

    if (heroIds?.length) {
      arg = {
        // @ts-ignore
        where: {
          id: {
            in: heroIds
          }
        },
        ...arg
      }
    }

    const results = await this.prisma.hero.findMany(arg)

    return results.map((x) => ({
      ...x,
      attributeName: x.heroAttributes[0].attriubute.name
    }))
  }

  public getHero = async ({ heroId }): Promise<Hero | null> => {
    return await this.prisma.hero.findUnique({
      where: {
        id: heroId
      },
      include: {
        heroAttributes: {
          include: {
            attriubute: true
          }
        }
      }
    })
  }

  public create = async ({
    userId,
    name
  }: {
    userId: string
    name: string
  }): Promise<Hero> => {
    const attributes = await this.prisma.attribute.findMany()

    const newHero: Prisma.HeroCreateInput = {
      name: name,
      multiverse: uuidv1(),
      heroAttributes: {
        create: [
          {
            attributeId:
              attributes[Math.floor(Math.random() * attributes.length)].id
          }
        ]
      },
      user: {
        connect: {
          id: userId
        }
      }
    }

    return await this.prisma.hero.create({
      data: newHero
    })
  }

  public purchaseHero = async ({
    userId,
    heroName
  }: {
    userId: string
    heroName: string
  }): Promise<Hero> => {
    const timeShardService = new TimeShardService(this.prisma)
    const userService = new UserService(this.prisma)
    const user = await userService.findUserById(userId)

    if (user == null) {
      throw new Error('User not found')
    }

    if (user.timeShards < HERO_PRICE_IN_TIME_SHARDS) {
      throw new Error('User does not have enough timeshards')
    }

    const newHero = await this.create({ userId: user.id, name: heroName })

    await timeShardService.debitAccount({
      userId,
      amount: HERO_PRICE_IN_TIME_SHARDS,
      transactionType: TransactionTypeEnum.heroPurchaseDebit
    })

    return newHero
  }
}

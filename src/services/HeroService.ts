import { Hero, Prisma, PrismaClient } from '@prisma/client'
import { v1 as uuidv1 } from 'uuid'
export class HeroService {
  prisma: PrismaClient;

  constructor (prisma: PrismaClient) {
    this.prisma = prisma
  }

  public getHeros = async (heroIds?: string[]): Promise<any> => {
    var arg = {      
      include: {
      heroAttributes: {
        include: {
          attriubute: true
        }
      }
    }}

    if (heroIds?.length) {
      arg = {
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
  };

  public create = async (args): Promise<Hero> => {
    const { name, userId } = args

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
  };
}

import { Hero, Prisma, PrismaClient } from "@prisma/client";
import { v1 as uuidv1 } from "uuid";
export class HeroService {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public getHeros = async (): Promise<Hero[]> => {
    return await this.prisma.hero.findMany();
  };

  public create = async (args): Promise<Hero> => {
    const { name } = args;

    let newHero: Prisma.HeroCreateInput = {
      name: name,
      multiverse: uuidv1(),
    };

    const attributes = await this.prisma.attribute.findMany();

    let result = await this.prisma.hero.create({
      data: newHero,
    });

    await this.prisma.heroAttribute.create({
      data: {
        heroId: result.id,
        attributeId:
          attributes[Math.floor(Math.random() * attributes.length)].id,
      },
    });

    // @ts-ignore
    result = await this.prisma.hero.findUnique({
      where: {
        id: result.id,
      },
      include: {
        attributes: true,
      },
    });

    return result;
  };
}

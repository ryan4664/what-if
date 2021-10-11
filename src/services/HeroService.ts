import { Hero, PrismaClient } from ".prisma/client";
import { IResolverArgs } from "src/types";
import { v1 as uuidv1 } from "uuid";

export class HeroService {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public getHeros = async (): Promise<Hero[]> => {
    return await this.prisma.hero.findMany();
  };

  public create = async ({ args, context }: IResolverArgs): Promise<Hero> => {
    const { name } = args;

    let newHero: Hero = {
      id: uuidv1(),
      name: name,
      multiverse: uuidv1(),
    };

    const attributes =
      await context.dataSources.store.prisma.attribute.findMany();

    let result = await context.dataSources.store.prisma.hero.create({
      data: newHero,
    });

    await context.dataSources.store.prisma.heroAttribute.create({
      data: {
        heroId: result.id,
        attributeId:
          attributes[Math.floor(Math.random() * attributes.length)].id,
      },
    });

    result = await context.dataSources.store.prisma.hero.findUnique({
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

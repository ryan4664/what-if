import { Hero, Prisma, PrismaClient } from "@prisma/client";
import { v1 as uuidv1 } from "uuid";
export class HeroService {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public getHeros = async (): Promise<any> => {
    let results = await this.prisma.hero.findMany({
      include: {
        attributes: {
          include: {
            attriubute: true,
          },
        },
      },
    });

    return results.map((x) => ({
      ...x,
      attributeName: x.attributes[0].attriubute.name,
    }));
  };

  public create = async (args): Promise<Hero> => {
    const { name } = args;

    const attributes = await this.prisma.attribute.findMany();

    let newHero: Prisma.HeroCreateInput = {
      name: name,
      multiverse: uuidv1(),
      attributes: {
        create: [
          {
            attributeId:
              attributes[Math.floor(Math.random() * attributes.length)].id,
          },
        ],
      },
    };

    return await this.prisma.hero.create({
      data: newHero,
    });
  };
}

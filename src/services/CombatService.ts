import { PrismaClient } from '@prisma/client'
// import { v1 as uuidv1 } from 'uuid'

export class CombatService {
  prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  // public getHeros = async (): Promise<any> => {
  //   let results = await this.prisma.hero.findMany({
  //     include: {
  //       heroAttributes: {
  //         include: {
  //           attriubute: true,
  //         },
  //       },
  //     },
  //   });

  //   return results.map((x) => ({
  //     ...x,
  //     attributeName: x.heroAttributes[0].attriubute.name,
  //   }));
  // };
}

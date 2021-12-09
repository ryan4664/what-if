import { LevelTier, PrismaClient } from '@prisma/client'

export class LevelTierService {
  prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  public get = async (): Promise<LevelTier[]> => {
    return await this.prisma.levelTier.findMany({
      orderBy: [
        {
          minExperience: 'asc'
        }
      ]
    })
  }
}

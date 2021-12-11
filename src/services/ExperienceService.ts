import { LevelTier, PrismaClient, User } from '@prisma/client'
import { UserService } from './UserService'

export class ExperienceService {
  prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  public getLevelTiers = async (): Promise<LevelTier[]> => {
    return await this.prisma.levelTier.findMany({
      orderBy: [
        {
          minExperience: 'asc'
        }
      ]
    })
  }

  private creditUserLevel = async (
    user: User,
    amountToCredit: number
  ): Promise<User> => {
    return await this.prisma.user.update({
      data: {
        currentLevel: user.currentLevel + amountToCredit
      },
      where: {
        id: user.id
      }
    })
  }
  public creditUserExperience = async ({
    userId,
    amountToCredit
  }: {
    userId: string
    amountToCredit: number
  }): Promise<User | null> => {
    const userService = new UserService(this.prisma)

    var user = await userService.findUserById(userId)

    if (user == null) {
      throw new Error('User not found')
    }
    var previousExperience = user.currentExperience
    var updatedExperience = previousExperience + amountToCredit

    const levelTiers = await this.getLevelTiers()
    var levelsToCredit = 0

    var nextLevelTier = levelTiers.find(
      (x) => x.level === user!.currentLevel + 1
    )

    if (!nextLevelTier) {
      // max level, nothing to do
      return null
    }

    do {
      if (updatedExperience >= nextLevelTier.minExperience) {
        levelsToCredit += 1
        nextLevelTier = levelTiers.find((x) => x.level === levelsToCredit + 1)

        if (!nextLevelTier) {
          // max level, nothing to do
          break
        }

        user.currentExperience = updatedExperience - nextLevelTier.minExperience
      }
    } while (updatedExperience > nextLevelTier.minExperience)

    if (levelsToCredit > 0) {
      await this.creditUserLevel(user, levelsToCredit)
    }

    return await this.prisma.user.update({
      data: {
        currentExperience: updatedExperience
      },
      where: {
        id: userId
      }
    })
  }
}

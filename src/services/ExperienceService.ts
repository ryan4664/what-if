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

  private creditUserLevel = async (user: User): Promise<User> => {
    return await this.prisma.user.update({
      data: {
        currentLevel: user.currentLevel + 1
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
  }): Promise<void> => {
    const userService = new UserService(this.prisma)

    var user = await userService.findUserById(userId)

    if (user == null) {
      throw new Error('User not found')
    }

    const previousExperience = user.currentExperience
    const updatedExperience = previousExperience + amountToCredit

    const levelTiers = await this.getLevelTiers()

    const nextLevelTier = levelTiers.find(
      (x) => x.level === user!.currentLevel + 1
    )

    if (!nextLevelTier) {
      throw new Error('Error checking level requirements')
    }

    if (updatedExperience >= nextLevelTier.minExperience) {
      console.log(`User: ${user.id} is leveling up! ${user.currentLevel}`)
      user = await this.creditUserLevel(user)
      console.log(`User: ${user.id} has leveled up! ${user.currentLevel}`)
      // TODO: This will only handle leveling up once, loop here
      user.currentExperience = updatedExperience - nextLevelTier.minExperience
    }

    await this.prisma.user.update({
      data: {
        currentExperience: updatedExperience
      },
      where: {
        id: userId
      }
    })
  }
}

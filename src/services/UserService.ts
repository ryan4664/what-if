import { PrismaClient, User } from '@prisma/client'
import { HeroService } from './HeroService'
import bcrypt from 'bcryptjs'

export class UserService {
  prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  public getUser = async ({ userId }): Promise<User> => {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        heros: true
      }
    })

    if (user == null) {
      throw new Error('User not found')
    }

    return user
  }

  public findUser = async ({ emailAddress }): Promise<User> => {
    const user = await this.prisma.user.findUnique({
      where: {
        emailAddress: emailAddress
      }
    })

    if (user == null) {
      throw new Error('User not found')
    }
    return user
  }

  public getUsers = async (): Promise<User[]> => {
    return await this.prisma.user.findMany({
      include: {
        heros: true
      }
    })
  }

  public create = async (args): Promise<User> => {
    const { emailAddress, password } = args

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    return await this.prisma.user.create({
      data: {
        emailAddress,
        password: hashedPassword,
        timeShards: 100
      }
    })
  }

  public purchaseHero = async (args) => {
    const { userId, heroName } = args

    const heroService = new HeroService(this.prisma)

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    if (user == null) {
      throw new Error('User not found')
    }

    if (user.timeShards < 100) {
      throw new Error('User does not have enough timeshards')
    }

    await heroService.create({ userId: user.id, name: heroName })

    await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        timeShards: user.timeShards - 100
      }
    })
  }
}

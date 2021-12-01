import { PrismaClient, User } from '@prisma/client'

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

  public findUser = async ({ emailAddress }): Promise<User | null> => {
    const user = await this.prisma.user.findUnique({
      where: {
        emailAddress: emailAddress
      }
    })

    return user
  }

  public getUsers = async (): Promise<User[]> => {
    return await this.prisma.user.findMany({
      include: {
        heros: true
      }
    })
  }

  public create = async ({
    emailAddress,
    password
  }: {
    emailAddress: string
    password: string
  }): Promise<User> => {
    return await this.prisma.user.create({
      data: {
        emailAddress,
        password,
        timeShards: 100
      }
    })
  }
}

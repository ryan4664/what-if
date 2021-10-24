import { PrismaClient } from '@prisma/client'
import { UserService } from './UserService'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export class AuthService {
  prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  public login = async ({ emailAddress, password }): Promise<string> => {
    const user = await new UserService(this.prisma).findUser({ emailAddress })

    if (user == null) {
      throw new Error('User not found')
    }

    const result = await bcrypt.compare(password, user.password)

    if (!result) {
      throw new Error('Invalid credentials')
    }

    return jwt.sign({ userId: user.id }, 'someKey')
  }
}

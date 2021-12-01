import { PrismaClient } from '@prisma/client'
import { UserService } from './UserService'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { HERO_PRICE_IN_TIME_SHARDS } from './HeroService'

const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
export class AuthService {
  prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  public login = async ({
    emailAddress,
    password
  }: {
    emailAddress: string
    password: string
  }): Promise<string> => {
    if (!emailAddress || !password) {
      throw new Error('A username and password is required')
    }

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

  public register = async ({
    emailAddress,
    password
  }: {
    emailAddress: string
    password: string
  }): Promise<string> => {
    if (!emailAddress || !password) {
      throw new Error('A username and password is required')
    }

    const user = await new UserService(this.prisma).findUser({ emailAddress })

    if (user !== null) {
      throw new Error('Email already in use.')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const userService = new UserService(this.prisma)

    let emailIsValid = String(emailAddress).toLowerCase().match(EMAIL_REGEX)

    if (!emailIsValid) {
      throw new Error('Invalid email address')
    }

    const newUser = {
      emailAddress,
      password: hashedPassword,
      timeShards: HERO_PRICE_IN_TIME_SHARDS
    }

    const result = await userService.create(newUser)

    // TODO: replace with env var
    return jwt.sign({ userId: result.id }, 'someKey')
  }
}

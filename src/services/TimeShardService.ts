import { PrismaClient } from '@prisma/client'
import { UserService } from './UserService'

export enum TransactionTypeEnum {
  testDebit = -2,
  testCredit = -1,
  heroPurchaseDebit = 1
}

export class TimeShardService {
  prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  public getTransactionHistoryItemsByUserId = async ({
    userId
  }: {
    userId: string
  }) => {
    const userService = new UserService(this.prisma)

    const user = await userService.findUserById(userId)

    if (user == null) {
      throw new Error('User not found')
    }

    return await this.prisma.transactionHistory.findMany({
      where: {
        userId
      }
    })
  }

  public debitAccount = async ({
    userId,
    amount: amountToDebit,
    transactionType
  }: {
    userId: string
    amount: number
    transactionType: TransactionTypeEnum
  }) => {
    const userService = new UserService(this.prisma)

    const user = await userService.findUserById(userId)

    if (user == null) {
      throw new Error('User not found')
    }

    const previousAmount = user.timeShards
    const updatedAmount = previousAmount - amountToDebit

    await this.createTransactionHistoryItem({
      userId,
      previousTimeShards: previousAmount,
      timeShardsDelta: amountToDebit,
      updatedTimeShards: updatedAmount,
      transactionType
    })

    await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        timeShards: updatedAmount
      }
    })
  }

  public creditAccount = async ({
    userId,
    amount: amountToCredit,
    transactionType
  }: {
    userId: string
    amount: number
    transactionType: TransactionTypeEnum
  }) => {
    const userService = new UserService(this.prisma)

    const user = await userService.findUserById(userId)

    if (user == null) {
      throw new Error('User not found')
    }

    const previousAmount = user.timeShards
    const updatedAmount = previousAmount + amountToCredit

    await this.createTransactionHistoryItem({
      userId,
      previousTimeShards: previousAmount,
      timeShardsDelta: amountToCredit,
      updatedTimeShards: updatedAmount,
      transactionType
    })

    await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        timeShards: updatedAmount
      }
    })
  }

  public createTransactionHistoryItem = async ({
    userId,
    previousTimeShards,
    timeShardsDelta,
    updatedTimeShards,
    transactionType
  }: {
    userId: string
    previousTimeShards: number
    timeShardsDelta: number
    updatedTimeShards: number
    transactionType: TransactionTypeEnum
  }) => {
    await this.prisma.transactionHistory.create({
      data: {
        userId: userId,
        previousTimeShards: previousTimeShards,
        timeShardsDelta: timeShardsDelta,
        updatedTimeShards: updatedTimeShards,
        transactionType: transactionType
      }
    })
  }
}

import { PrismaClient } from '@prisma/client'
import { UserService } from './UserService'

export enum TransactionTypeEnum {
  heroPurchaseDebit = 0
}

export class TimeShardService {
  prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
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

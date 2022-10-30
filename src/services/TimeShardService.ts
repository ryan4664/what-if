import { PrismaClient } from '@prisma/client'
import { UserService } from './UserService'
import { TransactionTypeEnum, UserBalance } from './types'

// TODO: It would be cool to inject users into the context here
export class TimeShardService {
    prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }

    public getTransactionHistoryItemsByUserId = async ({
                                                           userId,
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
                userId,
            },
        })
    }

    public getUserBalance = async ({
                                       userId,
                                   }: { userId: string }): Promise<UserBalance> => {
        const userService = new UserService(this.prisma)

        const user = await userService.findUserById(userId)

        if (user == null) {
            throw new Error('User not found')
        }

        // TODO: To be proper this should go through all transactions
        return {
            userId: user.id,
            timeShardBalance: user.timeShards,
        }
    }

    public debitAccount = async ({
                                     userId,
                                     amountToDebit,
                                     transactionType,
                                 }: {
        userId: string
        amountToDebit: number
        transactionType: TransactionTypeEnum
    }): Promise<UserBalance> => {
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
            transactionType,
        })

        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                timeShards: updatedAmount,
            },
        })

        return await this.getUserBalance({ userId: user.id })
    }

    public creditAccount = async ({
                                      userId,
                                      amountToCredit,
                                      transactionType,
                                  }: {
        userId: string
        amountToCredit: number
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
            transactionType,
        })

        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                timeShards: updatedAmount,
            },
        })

        return await this.getUserBalance({ userId: user.id })
    }

    private createTransactionHistoryItem = async ({
                                                     userId,
                                                     previousTimeShards,
                                                     timeShardsDelta,
                                                     updatedTimeShards,
                                                     transactionType,
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
                transactionType: transactionType,
            },
        })
    }
}

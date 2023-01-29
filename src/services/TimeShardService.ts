import { PrismaClient, TransactionHistory } from '@prisma/client'
import { UserService } from './UserService'
import { TransactionTypeEnum, UserBalance } from './types'

// TODO: It would be cool to inject users into the context here
export class TimeShardService {
	prisma: PrismaClient

	constructor(prisma: PrismaClient) {
		this.prisma = prisma
	}

	public getTransactionHistoryItemsByUserId = async ({
																											 userId
																										 }: {
		userId: string
	}): Promise<TransactionHistory[]> => {
		const userService = new UserService(this.prisma)

		const user = await userService.findUserById(userId)

		if (user == null) {
			throw new Error('User not found')
		}

		const result = await this.prisma.transactionHistory.findMany({
			where: {
				userId
			}
		})

		return result
	}

	public getUserBalance = async ({
																	 userId
																 }: { userId: string }): Promise<UserBalance> => {
		const userService = new UserService(this.prisma)

		const user = await userService.findUserById(userId)

		if (user == null) {
			throw new Error('User not found')
		}

		const transactionHistory = await this.getTransactionHistoryItemsByUserId({userId})

		const balance = transactionHistory.reduce(
			(prev, curr) => {
				if (curr.transactionType === TransactionTypeEnum.credit) {
					return prev + curr.timeShardsDelta
				} else {
					return prev - curr.timeShardsDelta
				}
			},
			0
		)

		// NOTE: Do we need the current balance on the user object?

		return {
			userId: user.id,
			timeShardBalance: balance
		}
	}

	public debitAccount = async ({
																 userId,
																 amountToDebit,
																 transactionType
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

		return await this.getUserBalance({userId: user.id})
	}

	public creditAccount = async ({
																	userId,
																	amountToCredit,
																	transactionType
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

		return await this.getUserBalance({userId: user.id})
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

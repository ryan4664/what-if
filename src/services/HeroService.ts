import { Hero, Prisma, PrismaClient } from '@prisma/client'
import { v1 as uuidv1 } from 'uuid'
import { UserService } from './UserService'
import { TimeShardService } from './'
import { TransactionTypeEnum } from './types'
import { WatcherService } from "src/services/WatcherService"

// Store somewhere?
export const HERO_PRICE_IN_TIME_SHARDS = 100

export class HeroService {
	prisma: PrismaClient

	constructor(prisma: PrismaClient) {
		this.prisma = prisma
	}

	public getHeroes = async (heroIds?: string[]): Promise<Hero[]> => {
		let arg = {
			include: {
				heroAttributes: {
					include: {
						attribute: true
					}
				}
			},
			where: {}
		}

		if (heroIds?.length) {
			arg.where = {
				id: {
					in: heroIds
				}
			}
		}

		const results = await this.prisma.hero.findMany(arg)

		return results.map((x) => ({
			...x
		}))
	}

	public findById = async (heroId: string) => {
		return this.prisma.hero.findUnique({
			where: {
				id: heroId
			},
			include: {
				heroAttributes: {
					include: {
						attribute: true
					}
				}
			}
		})
	}

	public create = async ({
													 userId,
													 name
												 }: {
		userId: string
		name: string
	}): Promise<Hero> => {
		const attributes = await this.prisma.attribute.findMany()

		const newHero: Prisma.HeroCreateInput = {
			name: name,
			homeMultiverse: uuidv1(),
			heroAttributes: {
				create: [
					{
						attributeId:
						attributes[Math.floor(Math.random() * attributes.length)].id
					}
				]
			},
			user: {
				connect: {
					id: userId
				}
			}
		}

		return this.prisma.hero.create({
			data: newHero
		})
	}

	public purchaseHero = async ({
																 userId,
																 heroName
															 }: {
		userId: string
		heroName: string
	}): Promise<Hero> => {
		const timeShardService = new TimeShardService(this.prisma)
		const watcherService = new WatcherService(this.prisma)
		const userService = new UserService(this.prisma)
		const user = await userService.findUserById(userId)

		if (user == null) {
			throw new Error('User not found')
		}

		if (user.timeShards < HERO_PRICE_IN_TIME_SHARDS) {
			throw new Error('User does not have enough timeshards')
		}

		const newHero = await this.create({userId: user.id, name: heroName})

		await timeShardService.debitAccount({
			userId,
			amountToDebit: HERO_PRICE_IN_TIME_SHARDS,
			transactionType: TransactionTypeEnum.heroPurchaseDebit
		})

		await watcherService.creditTimeShards(HERO_PRICE_IN_TIME_SHARDS)

		return newHero
	}
}

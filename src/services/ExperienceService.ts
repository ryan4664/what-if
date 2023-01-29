import { Hero, LevelTier, PrismaClient, User } from '@prisma/client'
import { LevelType } from '../types'
import { HeroService } from './HeroService'
import { UserService } from './UserService'

export class ExperienceService {
	prisma: PrismaClient

	constructor(prisma: PrismaClient) {
		this.prisma = prisma
	}

	public getLevelTiers = async (type: LevelType): Promise<LevelTier[]> => {
		return this.prisma.levelTier.findMany({
			where: {
				type: type
			},
			orderBy: [
				{
					minExperience: 'asc'
				}
			]
		})
	}

	public creditUserExperience = async ({
																				 userId,
																				 amountToCredit
																			 }: {
		userId: string
		amountToCredit: number
	}): Promise<User | null> => {
		const userService = new UserService(this.prisma)

		const user = await userService.findUserById(userId)

		if (user == null) {
			throw new Error('User not found')
		}
		const previousExperience = user.currentExperience
		let updatedExperience = previousExperience + amountToCredit

		const levelTiers = await this.getLevelTiers(LevelType.User)

		let nextLevelTier = levelTiers.find(
			(x) => x.level === user!.currentLevel + 1
		)

		let shouldLevelUp =
			nextLevelTier && updatedExperience >= nextLevelTier.minExperience
		let levelsToCredit = 0

		while (shouldLevelUp) {
			levelsToCredit += 1
			nextLevelTier = levelTiers.find(
				(x) => x.level === user.currentLevel + levelsToCredit + 1
			)

			if (!nextLevelTier) {
				shouldLevelUp = false
			} else {
				user.currentExperience = updatedExperience - nextLevelTier.minExperience
				if (user.currentExperience < 0) {
					shouldLevelUp = false
				}
			}
		}

		if (levelsToCredit > 0) {
			await this.creditUserLevel(user, levelsToCredit)
		}

		const lastLevelTier = levelTiers[levelTiers.length - 1]

		if (updatedExperience > lastLevelTier.minExperience) {
			updatedExperience = lastLevelTier.minExperience
		}

		return this.prisma.user.update({
			data: {
				currentExperience: updatedExperience
			},
			where: {
				id: userId
			}
		})
	}

	public creditHeroExperience = async ({
																				 heroId,
																				 amountToCredit
																			 }: {
		heroId: string
		amountToCredit: number
	}): Promise<Hero | null> => {
		const heroService = new HeroService(this.prisma)

		const hero = await heroService.findById(heroId)

		if (hero == null) {
			throw new Error('Hero not found')
		}
		const previousExperience = hero.currentExperience
		let updatedExperience = previousExperience + amountToCredit

		const levelTiers = await this.getLevelTiers(LevelType.Hero)

		let nextLevelTier = levelTiers.find(
			(x) => x.level === hero!.currentLevel + 1
		)

		let shouldLevelUp =
			nextLevelTier && updatedExperience >= nextLevelTier.minExperience
		let levelsToCredit = 0

		while (shouldLevelUp) {
			levelsToCredit += 1
			nextLevelTier = levelTiers.find(
				(x) => x.level === hero.currentLevel + levelsToCredit + 1
			)

			if (!nextLevelTier) {
				shouldLevelUp = false
			} else {
				hero.currentExperience = updatedExperience - nextLevelTier.minExperience
				if (hero.currentExperience < 0) {
					shouldLevelUp = false
				}
			}
		}

		if (levelsToCredit > 0) {
			await this.creditHeroLevel(hero, levelsToCredit)
		}

		const lastLevelTier = levelTiers[levelTiers.length - 1]

		if (updatedExperience > lastLevelTier.minExperience) {
			updatedExperience = lastLevelTier.minExperience
		}

		return this.prisma.hero.update({
			data: {
				currentExperience: updatedExperience
			},
			where: {
				id: heroId
			}
		})
	}

	private creditUserLevel = async (
		user: User,
		amountToCredit: number
	): Promise<User> => {
		return this.prisma.user.update({
			data: {
				currentLevel: user.currentLevel + amountToCredit
			},
			where: {
				id: user.id
			}
		})
	}

	private creditHeroLevel = async (
		hero: Hero,
		amountToCredit: number
	): Promise<Hero> => {
		return this.prisma.hero.update({
			data: {
				currentLevel: hero.currentLevel + amountToCredit
			},
			where: {
				id: hero.id
			}
		})
	}
}

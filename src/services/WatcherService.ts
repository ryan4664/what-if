import { PrismaClient, Watcher } from '@prisma/client'
import { VillainService } from "src/services/VillainService"

export class WatcherService {
	prisma: PrismaClient

	constructor(prisma: PrismaClient) {
		this.prisma = prisma
	}

	public getWatcher = async (): Promise<Watcher> => {
		const watcher = await this.prisma.watcher.findFirst()

		if (!watcher) {
			throw new Error("No Watcher Configured!")
		}

		return watcher
	}

	public creditTimeShards = async (amount: number): Promise<void> => {
		let watcher = await this.prisma.watcher.findFirst({
			include: {
				timeShardGoals: true
			}
		})

		if (!watcher) {
			throw new Error("No Watcher Configured!")
		}

		const updatedTimeShards = watcher.timeShards + amount

		await this.prisma.watcher.update({
			data: {
				timeShards: updatedTimeShards
			},
			where: {
				id: watcher.id
			}
		})

		const triggeredGoals = watcher.timeShardGoals.filter(goal =>
			!goal.isUnlocked &&
			updatedTimeShards >= goal.timeShardsRequired)

		const result = triggeredGoals.map(goal => this.unlockGoal(goal))

		await Promise.all(result)
	}

	public unlockGoal = async (goal) => {
		//  do whatever the goal should do
		//  For now it will just create a villain,
		//  but it could do any random set of events
		//  even some super special ones in the DB
		const villainService = new VillainService(this.prisma)
		await villainService.unlockVillain()

		//     mark the goal as triggered
		this.prisma.watcherTimeShardGoals.update({
			data: {
				isUnlocked: true
			},
			where: {
				id: goal.id
			}
		})
	}
}

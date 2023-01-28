import {PrismaClient, Watcher} from '@prisma/client'

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

        return
    }

    public unlockGoal = async (goal) => {
        //     do whatever the goal should do

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

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

}

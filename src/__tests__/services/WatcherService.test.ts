import { createMockContext, MockContext } from '../context'
import { WatcherService } from "../../services/WatcherService"
import watcherFactor from '../factories/watcher'

let mockCtx: MockContext
let watcherService: WatcherService

beforeEach(() => {
	mockCtx = createMockContext()
	mockCtx.prisma.watcher.findFirst.mockResolvedValue(null)
	watcherService = new WatcherService(mockCtx.prisma)
})

test('should throw an error ', async () => {
	await expect(watcherService.getWatcher()).rejects.toThrowError()
})

test('should return the watcher ', async () => {
	const watcher = watcherFactor.build()
	mockCtx.prisma.watcher.findFirst.mockResolvedValue(watcher)

	const result = await watcherService.getWatcher()
	expect(result).not.toBeNull()
})
import { HeroService } from '../../services/HeroService'
import { createMockContext, MockContext } from '../context'
import userFactory from '../factories/user'
import heroFactory from '../factories/hero'

let mockCtx: MockContext
let heroService: HeroService

beforeEach(() => {
	mockCtx = createMockContext()
	mockCtx.prisma.hero.findMany.mockResolvedValue([])
	heroService = new HeroService(mockCtx.prisma)
})

test('should return no heroes ', async () => {
	const result = await heroService.getHeroes()
	expect(result.length).toEqual(0)
})

test('should return some heroes ', async () => {
	const user = userFactory.build()

	const hero = heroFactory.build({userId: user.id})

	mockCtx.prisma.hero.findMany.mockResolvedValue([hero])

	const result = await heroService.getHeroes()
	expect(result.length).toEqual(1)
})
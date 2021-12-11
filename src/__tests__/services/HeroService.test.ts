import { HeroService } from '../../services/HeroService'
import { MockContext, createMockContext } from '../context'
import userFactory from '../factories/user'
import heroFactory from '../factories/hero'

let mockCtx: MockContext
let heroService: HeroService

beforeEach(() => {
  mockCtx = createMockContext()
  mockCtx.prisma.hero.findMany.mockResolvedValue([])
  heroService = new HeroService(mockCtx.prisma)
})

test('should return no heros ', async () => {
  const result = await heroService.getHeros()
  expect(result.length).toEqual(0)
})

test('should return some heros ', async () => {
  const user = userFactory.build()

  const hero = heroFactory.build({ userId: user.id })

  mockCtx.prisma.hero.findMany.mockResolvedValue([hero])

  const result = await heroService.getHeros()
  expect(result.length).toEqual(1)
})

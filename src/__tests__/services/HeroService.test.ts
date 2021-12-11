import { HeroService } from '../../services/HeroService'
import { MockContext, createMockContext } from '../context'

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

import { v4 as uuidv4 } from 'uuid'
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

test('should return some heros ', async () => {
  const hero = {
    id: uuidv4(),
    multiverse: uuidv4(),
    name: uuidv4(),
    userId: uuidv4(),
    currentLevel: 1,
    currentExperience: 0,
    totalHealth: 100,
    currentHealth: 100,
    speed: 100,
    speach: 100
  }
  mockCtx.prisma.hero.findMany.mockResolvedValue([hero])

  const result = await heroService.getHeros()
  expect(result.length).toEqual(1)
})

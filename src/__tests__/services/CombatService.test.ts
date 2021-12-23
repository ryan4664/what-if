import { CombatService } from '../../services/CombatService'
import { createMockContext, MockContext } from '../context'
import heroFactory from '../factories/hero'

let mockCtx: MockContext
// @ts-ignore
let combatService: CombatService

beforeEach(() => {
  mockCtx = createMockContext()
  combatService = new CombatService(mockCtx.prisma)
})

test('it should do combat ', async () => {
  const heroOne = heroFactory.build()
  const heroTwo = heroFactory.build()

  mockCtx.prisma.hero.findUnique.mockResolvedValueOnce(heroOne)
  mockCtx.prisma.hero.findUnique.mockResolvedValueOnce(heroTwo)

  let result = await combatService.oneOnOnePVP({
    heroOneId: heroOne.id,
    heroTwoId: heroTwo.id
  })

  console.log(result.log)

  // expect(mockCtx.prisma.hero.update).toBeCalledTimes(2)
})

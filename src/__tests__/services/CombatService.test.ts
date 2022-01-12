import { LevelType } from '../../types'
import { v4 as uuidv4 } from 'uuid'
import { CombatService } from '../../services/CombatService'
import { createMockContext, MockContext } from '../context'
import heroFactory from '../factories/hero'
import userFactory from '../factories/user'

let mockCtx: MockContext
// @ts-ignore
let combatService: CombatService

beforeEach(() => {
  mockCtx = createMockContext()
  combatService = new CombatService(mockCtx.prisma)
})

test('it should do combat ', async () => {
  const userOne = userFactory.build({ id: uuidv4() })
  const userTwo = userFactory.build({ id: uuidv4() })

  mockCtx.prisma.levelTier.findMany.mockResolvedValue([
    {
      id: '1',
      level: 2,
      minExperience: 1000,
      type: LevelType.User
    }
  ])

  mockCtx.prisma.user.findUnique.mockResolvedValueOnce(userOne)
  mockCtx.prisma.user.findUnique.mockResolvedValueOnce(userTwo)

  const heroOne = heroFactory.build({ userId: userOne.id })
  const heroTwo = heroFactory.build({ userId: userTwo.id })

  mockCtx.prisma.hero.findUnique.mockResolvedValueOnce(heroOne)
  mockCtx.prisma.hero.findUnique.mockResolvedValueOnce(heroTwo)

  let result = await combatService.oneOnOnePVP({
    heroOneId: heroOne.id,
    heroTwoId: heroTwo.id
  })

  expect(result.log.length).toBeGreaterThan(0)

  expect(result.heroOneId).not.toBeNull()
  expect(result.heroTwoId).not.toBeNull()
  expect(result.isDraw).not.toBeNull()

  expect(mockCtx.prisma.user.update).toBeCalledWith(
    expect.objectContaining({
      where: {
        id: userOne.id
      }
    })
  )

  expect(mockCtx.prisma.user.update).toBeCalledWith(
    expect.objectContaining({
      where: {
        id: userTwo.id
      }
    })
  )
})

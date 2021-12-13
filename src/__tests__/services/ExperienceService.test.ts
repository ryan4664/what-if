import { ExperienceService } from '../../services/ExperienceService'
import { MockContext, createMockContext } from '../context'
import userFactory from '../factories/user'

let mockCtx: MockContext
let experienceService: ExperienceService

beforeEach(() => {
  mockCtx = createMockContext()
  mockCtx.prisma.hero.findMany.mockResolvedValue([])
  experienceService = new ExperienceService(mockCtx.prisma)
})

test('should gain experince but not level up ', async () => {
  const user = userFactory.build()
  mockCtx.prisma.user.findUnique.mockResolvedValue(user)

  mockCtx.prisma.levelTier.findMany.mockResolvedValue([
    {
      id: '1',
      level: 2,
      minExperience: 1000
    }
  ])

  mockCtx.prisma.user.update.mockResolvedValue({
    ...user,
    currentExperience: user.currentExperience + 500
  })

  const updatedUser = await experienceService.creditUserExperience({
    userId: user.id,
    amountToCredit: 500
  })

  expect(updatedUser?.currentExperience).toEqual(user.currentExperience + 500)
  expect(updatedUser?.currentLevel).toEqual(user.currentLevel)
})

test('should gain experince and level up once ', async () => {
  const user = userFactory.build()
  mockCtx.prisma.user.findUnique.mockResolvedValue(user)
  mockCtx.prisma.levelTier.findMany.mockResolvedValue([
    {
      id: '1',
      level: 2,
      minExperience: 1000
    }
  ])

  mockCtx.prisma.user.update.mockResolvedValue({
    ...user,
    currentExperience: user.currentExperience + 1500,
    currentLevel: user.currentLevel + 1
  })

  const updatedUser = await experienceService.creditUserExperience({
    userId: user.id,
    amountToCredit: 1500
  })

  expect(updatedUser?.currentExperience).toEqual(1500)
  expect(updatedUser?.currentLevel).toEqual(2)
})

test('should gain experince and level up twice ', async () => {
  const user = userFactory.build()
  mockCtx.prisma.user.findUnique.mockResolvedValue(user)
  mockCtx.prisma.levelTier.findMany.mockResolvedValue([
    {
      id: '1',
      level: 2,
      minExperience: 1000
    },
    {
      id: '2',
      level: 3,
      minExperience: 2000
    }
  ])

  mockCtx.prisma.user.update.mockResolvedValue({
    ...user,
    currentExperience: user.currentExperience + 2500,
    currentLevel: user.currentLevel + 2
  })

  const updatedUser = await experienceService.creditUserExperience({
    userId: user.id,
    amountToCredit: 1500
  })

  expect(updatedUser?.currentExperience).toEqual(2500)
  expect(updatedUser?.currentLevel).toEqual(3)
})

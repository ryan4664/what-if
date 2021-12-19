import { LevelType } from '../../types'
import { ExperienceService } from '../../services/ExperienceService'
import { MockContext, createMockContext } from '../context'
import userFactory from '../factories/user'

// import heroFactory from '../factories/hero'

let mockCtx: MockContext
let experienceService: ExperienceService

beforeEach(() => {
  mockCtx = createMockContext()
  experienceService = new ExperienceService(mockCtx.prisma)
})

// User

test('should gain experince but not level up ', async () => {
  const user = userFactory.build()
  mockCtx.prisma.user.findUnique.mockResolvedValue(user)

  mockCtx.prisma.levelTier.findMany.mockResolvedValue([
    {
      id: '1',
      level: 2,
      minExperience: 1000,
      type: LevelType.User
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

  expect(mockCtx.prisma.user.update).toBeCalledWith(
    expect.objectContaining({
      data: {
        currentExperience: 500
      },
      where: {
        id: user.id
      }
    })
  )

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
      minExperience: 1000,
      type: LevelType.User
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

  expect(mockCtx.prisma.user.update).toBeCalledWith(
    expect.objectContaining({
      data: {
        currentLevel: 2
      },
      where: {
        id: user.id
      }
    })
  )

  expect(mockCtx.prisma.user.update).toBeCalledWith(
    expect.objectContaining({
      data: {
        currentExperience: 1500
      },
      where: {
        id: user.id
      }
    })
  )

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
      minExperience: 1000,
      type: LevelType.User
    },
    {
      id: '2',
      level: 3,
      minExperience: 2000,
      type: LevelType.User
    }
  ])

  mockCtx.prisma.user.update.mockResolvedValue({
    ...user,
    currentExperience: user.currentExperience + 2500
  })

  await experienceService.creditUserExperience({
    userId: user.id,
    amountToCredit: 2500
  })

  expect(mockCtx.prisma.user.update).toBeCalledWith(
    expect.objectContaining({
      data: {
        currentLevel: 3
      },
      where: {
        id: user.id
      }
    })
  )

  expect(mockCtx.prisma.user.update).toBeCalledWith(
    expect.objectContaining({
      data: {
        currentExperience: 2500
      },
      where: {
        id: user.id
      }
    })
  )
})

test('should gain experince and level up three times ', async () => {
  const user = userFactory.build()
  mockCtx.prisma.user.findUnique.mockResolvedValue(user)
  mockCtx.prisma.levelTier.findMany.mockResolvedValue([
    {
      id: '1',
      level: 2,
      minExperience: 1000,
      type: LevelType.User
    },
    {
      id: '2',
      level: 3,
      minExperience: 2000,
      type: LevelType.User
    },
    {
      id: '3',
      level: 4,
      minExperience: 5000,
      type: LevelType.User
    }
  ])

  mockCtx.prisma.user.update.mockResolvedValue({
    ...user,
    currentExperience: user.currentExperience + 5000
  })

  await experienceService.creditUserExperience({
    userId: user.id,
    amountToCredit: 5000
  })

  expect(mockCtx.prisma.user.update).toBeCalledWith(
    expect.objectContaining({
      data: {
        currentLevel: 4
      },
      where: {
        id: user.id
      }
    })
  )

  expect(mockCtx.prisma.user.update).toBeCalledWith(
    expect.objectContaining({
      data: {
        currentExperience: 5000
      },
      where: {
        id: user.id
      }
    })
  )
})

// Hero

// test('should gain experince but not level up ', async () => {
//   const hero = heroFactory.build()
//   mockCtx.prisma.hero.findUnique.mockResolvedValue(hero)

//   mockCtx.prisma.levelTier.findMany.mockResolvedValue([
//     {
//       id: '1',
//       level: 2,
//       minExperience: 1000,
//       type: LevelType.Hero
//     }
//   ])

//   const updatedHero = await experienceService.creditHeroExperience({
//     heroId: hero.id,
//     amountToCredit: 500
//   })

//   expect(mockCtx.prisma.hero.update).toBeCalledWith(
//     expect.objectContaining({
//       data: {
//         currentExperience: 500
//       },
//       where: {
//         id: hero.id
//       }
//     })
//   )

//   expect(updatedHero?.currentExperience).toEqual(hero.currentExperience + 500)
//   expect(updatedHero?.currentLevel).toEqual(hero.currentLevel)
// })

// test('should gain experince and level up once ', async () => {
//   const hero = heroFactory.build()
//   mockCtx.prisma.hero.findUnique.mockResolvedValue(hero)
//   mockCtx.prisma.levelTier.findMany.mockResolvedValue([
//     {
//       id: '1',
//       level: 2,
//       minExperience: 1000,
//       type: LevelType.Hero
//     }
//   ])

//   const updatedHero = await experienceService.creditHeroExperience({
//     heroId: hero.id,
//     amountToCredit: 1500
//   })

//   expect(mockCtx.prisma.hero.update).toBeCalledWith(
//     expect.objectContaining({
//       data: {
//         currentLevel: 2
//       },
//       where: {
//         id: hero.id
//       }
//     })
//   )

//   expect(mockCtx.prisma.hero.update).toBeCalledWith(
//     expect.objectContaining({
//       data: {
//         currentExperience: 1500
//       },
//       where: {
//         id: hero.id
//       }
//     })
//   )

//   expect(updatedHero?.currentExperience).toEqual(1500)
//   expect(updatedHero?.currentLevel).toEqual(2)
// })

// test('should gain experince and level up twice ', async () => {
//   const hero = heroFactory.build()
//   mockCtx.prisma.hero.findUnique.mockResolvedValue(hero)
//   mockCtx.prisma.levelTier.findMany.mockResolvedValue([
//     {
//       id: '1',
//       level: 2,
//       minExperience: 1000,
//       type: LevelType.Hero
//     },
//     {
//       id: '2',
//       level: 3,
//       minExperience: 2000,
//       type: LevelType.Hero
//     }
//   ])

//   await experienceService.creditHeroExperience({
//     heroId: hero.id,
//     amountToCredit: 2500
//   })

//   expect(mockCtx.prisma.hero.update).toBeCalledWith(
//     expect.objectContaining({
//       data: {
//         currentLevel: 3
//       },
//       where: {
//         id: hero.id
//       }
//     })
//   )

//   expect(mockCtx.prisma.hero.update).toBeCalledWith(
//     expect.objectContaining({
//       data: {
//         currentExperience: 2500
//       },
//       where: {
//         id: hero.id
//       }
//     })
//   )
// })

// test('should gain experince and level up three times ', async () => {
//   const hero = heroFactory.build()
//   mockCtx.prisma.hero.findUnique.mockResolvedValue(hero)
//   mockCtx.prisma.levelTier.findMany.mockResolvedValue([
//     {
//       id: '1',
//       level: 2,
//       minExperience: 1000,
//       type: LevelType.Hero
//     },
//     {
//       id: '2',
//       level: 3,
//       minExperience: 2000,
//       type: LevelType.Hero
//     },
//     {
//       id: '3',
//       level: 4,
//       minExperience: 5000,
//       type: LevelType.Hero
//     }
//   ])

//   await experienceService.creditHeroExperience({
//     heroId: hero.id,
//     amountToCredit: 5000
//   })

//   expect(mockCtx.prisma.hero.update).toBeCalledWith(
//     expect.objectContaining({
//       data: {
//         currentLevel: 4
//       },
//       where: {
//         id: hero.id
//       }
//     })
//   )

//   expect(mockCtx.prisma.hero.update).toBeCalledWith(
//     expect.objectContaining({
//       data: {
//         currentExperience: 5000
//       },
//       where: {
//         id: hero.id
//       }
//     })
//   )
// })

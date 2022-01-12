import { LevelType } from '../../types'
import { ExperienceService } from '../../services/ExperienceService'
import { MockContext, createMockContext } from '../context'
import userFactory from '../factories/user'

import heroFactory from '../factories/hero'

let mockCtx: MockContext
let experienceService: ExperienceService

beforeEach(() => {
  mockCtx = createMockContext()
  experienceService = new ExperienceService(mockCtx.prisma)
})

// User

test('should gain experience but not level up ', async () => {
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
    currentExperience: user.currentExperience + 501
  })

  await experienceService.creditUserExperience({
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

  expect(mockCtx.prisma.user.update).toBeCalledTimes(1)
})

test('should gain experience and level up once ', async () => {
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
      minExperience: 10000,
      type: LevelType.User
    }
  ])

  mockCtx.prisma.user.update.mockResolvedValue({
    ...user,
    currentExperience: user.currentExperience + 1500,
    currentLevel: user.currentLevel + 1
  })

  await experienceService.creditUserExperience({
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

  expect(mockCtx.prisma.user.update).toBeCalledTimes(2)
})

test('should gain experience and level up twice ', async () => {
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
      id: '2',
      level: 4,
      minExperience: 20000,
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

  expect(mockCtx.prisma.user.update).toBeCalledTimes(2)
})

test('should gain experience and level up three times ', async () => {
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
    },
    {
      id: '4',
      level: 5,
      minExperience: 50000,
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

  expect(mockCtx.prisma.user.update).toBeCalledTimes(2)
})

test('should gain experience and hit max level ', async () => {
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
    },
    {
      id: '4',
      level: 5,
      minExperience: 50000,
      type: LevelType.User
    }
  ])

  mockCtx.prisma.user.update.mockResolvedValue({
    ...user,
    currentExperience: user.currentExperience + 5000
  })

  await experienceService.creditUserExperience({
    userId: user.id,
    amountToCredit: 100000
  })

  expect(mockCtx.prisma.user.update).toBeCalledWith(
    expect.objectContaining({
      data: {
        currentLevel: 5
      },
      where: {
        id: user.id
      }
    })
  )

  expect(mockCtx.prisma.user.update).toBeCalledWith(
    expect.objectContaining({
      data: {
        currentExperience: 50000
      },
      where: {
        id: user.id
      }
    })
  )

  expect(mockCtx.prisma.user.update).toBeCalledTimes(2)
})

// Hero

test('should gain experience but not level up ', async () => {
  const hero = heroFactory.build()

  hero.id
  mockCtx.prisma.hero.findUnique.mockResolvedValue(hero)

  mockCtx.prisma.levelTier.findMany.mockResolvedValue([
    {
      id: '1',
      level: 2,
      minExperience: 1000,
      type: LevelType.Hero
    }
  ])

  await experienceService.creditHeroExperience({
    heroId: hero.id,
    amountToCredit: 500
  })

  expect(mockCtx.prisma.hero.update).toBeCalledWith(
    expect.objectContaining({
      data: {
        currentExperience: 500
      },
      where: {
        id: hero.id
      }
    })
  )

  expect(mockCtx.prisma.hero.update).toBeCalledTimes(1)
})

test('should gain experience and level up once ', async () => {
  const hero = heroFactory.build()
  mockCtx.prisma.hero.findUnique.mockResolvedValue(hero)
  mockCtx.prisma.levelTier.findMany.mockResolvedValue([
    {
      id: '1',
      level: 2,
      minExperience: 1000,
      type: LevelType.Hero
    },
    {
      id: '2',
      level: 3,
      minExperience: 10000,
      type: LevelType.Hero
    }
  ])

  await experienceService.creditHeroExperience({
    heroId: hero.id,
    amountToCredit: 1500
  })

  expect(mockCtx.prisma.hero.update).toBeCalledWith(
    expect.objectContaining({
      data: {
        currentLevel: 2
      },
      where: {
        id: hero.id
      }
    })
  )

  expect(mockCtx.prisma.hero.update).toBeCalledWith(
    expect.objectContaining({
      data: {
        currentExperience: 1500
      },
      where: {
        id: hero.id
      }
    })
  )

  expect(mockCtx.prisma.hero.update).toBeCalledTimes(2)
})

test('should gain experience and level up twice ', async () => {
  const hero = heroFactory.build()
  mockCtx.prisma.hero.findUnique.mockResolvedValue(hero)
  mockCtx.prisma.levelTier.findMany.mockResolvedValue([
    {
      id: '1',
      level: 2,
      minExperience: 1000,
      type: LevelType.Hero
    },
    {
      id: '2',
      level: 3,
      minExperience: 2000,
      type: LevelType.Hero
    },
    {
      id: '2',
      level: 4,
      minExperience: 20000,
      type: LevelType.Hero
    }
  ])

  await experienceService.creditHeroExperience({
    heroId: hero.id,
    amountToCredit: 2500
  })

  expect(mockCtx.prisma.hero.update).toBeCalledWith(
    expect.objectContaining({
      data: {
        currentLevel: 3
      },
      where: {
        id: hero.id
      }
    })
  )

  expect(mockCtx.prisma.hero.update).toBeCalledWith(
    expect.objectContaining({
      data: {
        currentExperience: 2500
      },
      where: {
        id: hero.id
      }
    })
  )

  expect(mockCtx.prisma.hero.update).toBeCalledTimes(2)
})

test('should gain experience and level up three times ', async () => {
  const hero = heroFactory.build()
  mockCtx.prisma.hero.findUnique.mockResolvedValue(hero)
  mockCtx.prisma.levelTier.findMany.mockResolvedValue([
    {
      id: '1',
      level: 2,
      minExperience: 1000,
      type: LevelType.Hero
    },
    {
      id: '2',
      level: 3,
      minExperience: 2000,
      type: LevelType.Hero
    },
    {
      id: '3',
      level: 4,
      minExperience: 5000,
      type: LevelType.Hero
    },
    {
      id: '4',
      level: 5,
      minExperience: 50000,
      type: LevelType.Hero
    }
  ])

  await experienceService.creditHeroExperience({
    heroId: hero.id,
    amountToCredit: 5000
  })

  expect(mockCtx.prisma.hero.update).toBeCalledWith(
    expect.objectContaining({
      data: {
        currentLevel: 4
      },
      where: {
        id: hero.id
      }
    })
  )

  expect(mockCtx.prisma.hero.update).toBeCalledWith(
    expect.objectContaining({
      data: {
        currentExperience: 5000
      },
      where: {
        id: hero.id
      }
    })
  )

  expect(mockCtx.prisma.hero.update).toBeCalledTimes(2)
})

test('should gain experience and hit max level ', async () => {
  const hero = heroFactory.build()
  mockCtx.prisma.hero.findUnique.mockResolvedValue(hero)
  mockCtx.prisma.levelTier.findMany.mockResolvedValue([
    {
      id: '1',
      level: 2,
      minExperience: 1000,
      type: LevelType.Hero
    },
    {
      id: '2',
      level: 3,
      minExperience: 2000,
      type: LevelType.Hero
    },
    {
      id: '3',
      level: 4,
      minExperience: 5000,
      type: LevelType.Hero
    },
    {
      id: '4',
      level: 5,
      minExperience: 50000,
      type: LevelType.Hero
    }
  ])

  mockCtx.prisma.hero.update.mockResolvedValue({
    ...hero,
    currentExperience: hero.currentExperience + 5000
  })

  await experienceService.creditHeroExperience({
    heroId: hero.id,
    amountToCredit: 100000
  })

  expect(mockCtx.prisma.hero.update).toBeCalledWith(
    expect.objectContaining({
      data: {
        currentLevel: 5
      },
      where: {
        id: hero.id
      }
    })
  )

  expect(mockCtx.prisma.hero.update).toBeCalledWith(
    expect.objectContaining({
      data: {
        currentExperience: 50000
      },
      where: {
        id: hero.id
      }
    })
  )

  expect(mockCtx.prisma.hero.update).toBeCalledTimes(2)
})

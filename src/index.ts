import { PrismaClient } from '@prisma/client'
import { ApolloServer, gql } from 'apollo-server'
import { AttributeService } from './services/AttributeService'
import { AuthService } from './services/AuthService'
import { HeroService } from './services/HeroService'
import { ExperienceService } from './services/ExperienceService'
import { TimeShardService } from './services/TimeShardService'
import { UserService } from './services/UserService'
import { IApolloContext, IContextUser, LevelType, Store } from './types'
import { validateToken } from './util'

const typeDefs = gql`
  type Hero {
    id: ID
    homeMultiverse: String
    name: String
    attributes: [HeroAttribute]!
    attributeName: String
    totalHealth: Int!
    currentHealth: Int!
    speech: Int!
    currentExperience: Int!
    currentLevel: Int!
  }

  type Attribute {
    id: ID
    name: String
  }

  type HeroAttribute {
    id: ID
    heroId: String
    attributeId: String
    attribute: Attribute
  }

  type User {
    id: ID
    emailAddress: String!
    currentLevel: Int!
    currentExperience: Int!
    timeShards: Int!
    heros: [Hero!]!
  }

  type LevelTier {
    id: ID!
    level: Int!
    minExperience: Int!
    type: Int!
  }

  type WalletTransaction {
    id: ID!
    userId: String!
    previousTimeShards: Int!
    timeShardsDelta: Int!
    updatedTimeShards: Int!
    transactionType: Int!
  }

  type Query {
    heroes: [Hero!]!
    attributes: [Attribute!]!
    user(userId: ID!): User
    currentUser: User
    users: [User!]!
    userWalletTransactions: [WalletTransaction!]!
    levelTiers: [LevelTier!]!
  }

  type Mutation {
    login(emailAddress: String!, password: String!): String!
    register(emailAddress: String!, password: String!): String!
    createHero(name: String!): Hero!
    purchaseHero(heroName: String): Int!
    creditUserExperience(userId: String!, amountToCredit: Int!): User
    creditHeroExperience(heroId: String!, amountToCredit: Int!): Hero
  }
`

const resolvers = {
  Query: {
    heroes: async (_, ___, context: IApolloContext, __) => {
      const service = new HeroService(context.dataSources.store.prisma)
      return await service.getHeros()
    },
    attributes: async (_, ___, context: IApolloContext, __) => {
      const service = new AttributeService(context.dataSources.store.prisma)
      return await service.getAttributes()
    },
    user: async (_, { userId }, context: IApolloContext, __) => {
      const service = new UserService(context.dataSources.store.prisma)
      return await service.getUser({ userId })
    },
    currentUser: async (_, __, context: IApolloContext, ___) =>
      authenticatedCall(context, async () => {
        const service = new UserService(context.dataSources.store.prisma)
        return await service.getUser({ userId: context.user!.userId })
      }),
    users: async (_, ___, context: IApolloContext, __) => {
      const service = new UserService(context.dataSources.store.prisma)
      return await service.getUsers()
    },
    userWalletTransactions: async (_, ___, context: IApolloContext, __) =>
      authenticatedCall(context, async () => {
        const service = new TimeShardService(context.dataSources.store.prisma)
        return await service.getTransactionHistoryItemsByUserId({
          userId: context.user!.userId
        })
      }),
    levelTiers: async (_, ___, context: IApolloContext, __) => {
      const service = new ExperienceService(context.dataSources.store.prisma)
      // TODO: Filter me
      return await service.getLevelTiers(LevelType.User)
    }
  },
  Mutation: {
    login: async (
      _,
      { emailAddress, password },
      context: IApolloContext,
      __
    ) => {
      const service = new AuthService(context.dataSources.store.prisma)
      return await service.login({ emailAddress, password })
    },
    register: async (
      _,
      { emailAddress, password },
      context: IApolloContext,
      __
    ) => {
      const service = new AuthService(context.dataSources.store.prisma)
      return await service.register({ emailAddress, password })
    },
    createHero: async (_, { name }, context: IApolloContext, __) =>
      authenticatedCall(context, async () => {
        const service = new HeroService(context.dataSources.store.prisma)
        return await service.create({ userId: context.user!.userId, name })
      }),
    purchaseHero: async (_, { heroName }, context: IApolloContext, __) =>
      authenticatedCall(context, async () => {
        const service = new HeroService(context.dataSources.store.prisma)
        return await service.purchaseHero({
          userId: context.user!.userId,
          heroName
        })
      }),
    creditUserExperience: async (
      _,
      { userId, amountToCredit },
      context: IApolloContext,
      __
    ) => {
      const service = new ExperienceService(context.dataSources.store.prisma)
      return await service.creditUserExperience({ userId, amountToCredit })
    },
    creditHeroExperience: async (
      _,
      { heroId, amountToCredit },
      context: IApolloContext,
      __
    ) => {
      const service = new ExperienceService(context.dataSources.store.prisma)
      return await service.creditHeroExperience({ heroId, amountToCredit })
    }
  }
}

const authenticatedCall = (context: IApolloContext, func) => {
  if (!context.user) {
    throw new Error('Unauthenticted')
  }
  return func()
}

const createStore = async function () {
  return new PrismaClient({
    log: [
      {
        level: 'query',
        emit: 'stdout'
      }
    ]
  })
}

const main = async () => {
  const db = await createStore()

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
      store: new Store(db)
    }),
    context: ({ req }) => {
      const token = req.headers.authorization || ''
      let user: IContextUser | null = null
      if (token) {
        try {
          user = validateToken(token)
        } catch (error) {
          throw new Error('Invalid token')
        }
      }

      return {
        user
      }
    }
  })

  server
    .listen({ port: 4000 })
    .then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`)
    })
    .finally(async () => {
      await db.$disconnect()
    })
}

main()

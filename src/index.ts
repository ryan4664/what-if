import { PrismaClient } from '@prisma/client'
import { ApolloServer, gql } from 'apollo-server'
import { AttributeService } from './services/AttributeService'
import { AuthService } from './services/AuthService'
import { HeroService } from './services/HeroService'
import { LevelTierService } from './services/LevelTierService'
import { TimeShardService } from './services/TimeShardService'
import { UserService } from './services/UserService'
import { IApolloContext, Store } from './types'
import { validateToken } from './util'

const typeDefs = gql`
  type Hero {
    id: ID
    multiverse: String
    name: String
    attributes: [HeroAttribute]!
    attributeName: String
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
    emailAddress: String
    password: String
    timeShards: Int
    heros: [Hero!]!
  }

  type LevelTier {
    id: ID!
    level: Int!
    minExperience: Int
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
    heros: [Hero!]!
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
  }
`

const resolvers = {
  Query: {
    heros: async (_, ___, context: IApolloContext, __) => {
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
    currentUser: async (_, __, context: IApolloContext, ___) => {
      const service = new UserService(context.dataSources.store.prisma)
      // TODO: make this cleaner
      if (!context.user) {
        throw new Error('Unauthenticted')
      }
      return await service.getUser({ userId: context.user.userId })
    },
    users: async (_, ___, context: IApolloContext, __) => {
      const service = new UserService(context.dataSources.store.prisma)
      return await service.getUsers()
    },
    userWalletTransactions: async (_, ___, context: IApolloContext, __) => {
      const service = new TimeShardService(context.dataSources.store.prisma)
      // TODO: make this cleaner
      if (!context.user) {
        throw new Error('Unauthenticted')
      }

      return await service.getTransactionHistoryItemsByUserId({
        userId: context.user.userId
      })
    },
    levelTiers: async (_, ___, context: IApolloContext, __) => {
      const service = new LevelTierService(context.dataSources.store.prisma)
      return await service.get()
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
    createHero: async (_, { userId }, context: IApolloContext, __) => {
      const service = new HeroService(context.dataSources.store.prisma)
      return await service.create({ userId })
    },
    purchaseHero: async (_, { heroName }, context: IApolloContext, __) => {
      const service = new HeroService(context.dataSources.store.prisma)
      // TODO: make this cleaner
      if (!context.user) {
        throw new Error('Unauthenticted')
      }

      return await service.purchaseHero({
        userId: context.user.userId,
        heroName
      })
    }
  }
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
      let user = {}
      if (token) {
        user = validateToken(token)
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

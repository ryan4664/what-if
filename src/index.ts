import { ApolloServer, gql } from "apollo-server";
import { PrismaClient } from "@prisma/client";
import { Store } from "./types";
import { HeroService } from "./services/HeroService";
import { AttributeService } from "./services/AttributeService";
import { UserService } from "./services/UserService";

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

  type Query {
    heros: [Hero!]!
    attributes: [Attribute!]!
    user(userId: ID!): User
    users: [User!]!
  }

  type Mutation {
    createHero(name: String!): Hero!
    purchaseHero(userId: ID!, heroName: String): ID
  }
`;

const resolvers = {
  Query: {
    heros: async (_, args, context, __) => {
      const service = new HeroService(context.dataSources.store.prisma);
      return await service.getHeros();
    },
    attributes: async (_, args, context, __) => {
      const service = new AttributeService(context.dataSources.store.prisma);
      return await service.getAttributes();
    },
    user: async (_, args, context, __) => {
      const service = new UserService(context.dataSources.store.prisma);
      console.log(args);
      return await service.getUser({ userId: args.userId });
    },
    users: async (_, args, context, __) => {
      const service = new UserService(context.dataSources.store.prisma);
      return await service.getUsers();
    },
  },
  Mutation: {
    createHero: async (_, args, context, __) => {
      const service = new HeroService(context.dataSources.store.prisma);
      return await service.create(args);
    },
    purchaseHero: async (_, args, context, __) => {
      const service = new UserService(context.dataSources.store.prisma);
      return await service.purchaseHero({
        userId: args.userId,
        heroName: args.heroName,
      });
    },
  },
};

const createStore = async function () {
  return new PrismaClient({
    log: [
      {
        level: "query",
        emit: "stdout",
      },
    ],
  });
};

const main = async () => {
  let db = await createStore();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
      store: new Store(db),
    }),
    context: ({ req }) => {},
  });

  server
    .listen({ port: 4000 })
    .then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    })
    .finally(async () => {
      await db.$disconnect();
    });
};

main();

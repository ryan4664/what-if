import { ApolloServer, gql } from "apollo-server";
import { PrismaClient } from "@prisma/client";
import { Store } from "./types";
import { HeroService } from "./services/HeroService";
import { AttributeService } from "./services/AttributeService";

const typeDefs = gql`
  type Hero {
    id: String
    multiverse: String
    name: String
  }

  type Attribute {
    id: String
    name: String
  }

  type Query {
    heros: [Hero!]!
    attributes: [Attribute!]!
  }

  type Mutation {
    createHero(name: String!): Hero!
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
  },
  Mutation: {
    createHero: async (_, args, context, __) => {
      try {
        const service = new HeroService(context.dataSources.store.prisma);
        return await service.create(args);
      } catch (error) {
        console.log(error);
      }
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

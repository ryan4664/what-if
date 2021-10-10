import { ApolloServer, gql } from "apollo-server";
import { PrismaClient } from "@prisma/client";
import { Store } from "./types";
import { create, getHeros } from "./services/HeroService";
import { getAttributes } from "./services/AttributeService";

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
    heros: async (parent, args, context, info) => {
      return await getHeros({ parent, args, context, info });
    },
    attributes: async (parent, args, context, info) => {
      return await getAttributes({ parent, args, context, info });
    },
  },
  Mutation: {
    createHero: async (parent, args, context, info) => {
      return await create({ parent, args, context, info });
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
    .then(async ({ url }) => {
      console.log(`🚀  Server ready at ${url}, you get it!!!`);
    })
    .finally(async () => {
      await db.$disconnect();
    });
};

main();

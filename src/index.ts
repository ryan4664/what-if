import { ApolloServer, gql } from "apollo-server";
import { PrismaClient } from "@prisma/client";
import { Store } from "./types";
import { create, getHeros } from "./services/heros/HeroService";

const typeDefs = gql`
  type Hero {
    multiverse: String
    name: String
  }

  type Query {
    heros: [Hero!]!
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

  // definition and your set of resolvers.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
      store: new Store(db),
    }),
    context: ({ req }) => {},
  });

  // The `listen` method launches a web server.
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

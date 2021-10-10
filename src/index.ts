import { ApolloServer, gql } from "apollo-server";
import { PrismaClient } from "@prisma/client";
import { Store } from "./types";

const typeDefs = gql`
  type Hero {
    multiverse: String
  }

  type Query {
    heros: [Hero]
  }
`;

const resolvers = {
  Query: {
    heros: async (parent, args, {dataSources}: {dataSources: any}, info) => {
      return await dataSources.store.store.hero.findMany()
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
    .listen({port: 4000})
    .then(async ({ url }) => {
      console.log(`🚀  Server ready at ${url}, you get it!!!`);
    })
    .finally(async () => {
      await db.$disconnect();
    });
};

main();

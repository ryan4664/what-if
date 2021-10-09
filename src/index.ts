import { ApolloServer, gql } from "apollo-server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;

const resolvers = {
  Query: {
    books: () => books,
  },
};

// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server
  .listen()
  .then(async ({ url }) => {
    console.log(`🚀  Server ready at ${url}, you get it!!!`);

    const allUsers = await prisma.user.findMany()
    console.log(allUsers)

  })
  .finally(async () => {
    await prisma.$disconnect();
  });

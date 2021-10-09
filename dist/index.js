"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
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
const typeDefs = (0, apollo_server_1.gql) `
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
const server = new apollo_server_1.ApolloServer({ typeDefs, resolvers });
// The `listen` method launches a web server.
server
    .listen()
    .then(({ url }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`🚀  Server ready at ${url}, you get it!!!`);
    const allUsers = yield prisma.user.findMany();
    console.log(allUsers);
}))
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
//# sourceMappingURL=index.js.map
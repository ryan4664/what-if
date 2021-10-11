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
const types_1 = require("./types");
const HeroService_1 = require("./services/HeroService");
const AttributeService_1 = require("./services/AttributeService");
const typeDefs = (0, apollo_server_1.gql) `
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
        heros: (parent, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
            const heroService = new HeroService_1.HeroService(context.dataSources.store.prisma);
            return yield heroService.getHeros();
        }),
        attributes: (parent, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
            return yield (0, AttributeService_1.getAttributes)({ parent, args, context, info });
        }),
    },
    Mutation: {
        createHero: (parent, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
            return yield (0, HeroService_1.create)({ parent, args, context, info });
        }),
    },
};
const createStore = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return new client_1.PrismaClient({
            log: [
                {
                    level: "query",
                    emit: "stdout",
                },
            ],
        });
    });
};
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    let db = yield createStore();
    const server = new apollo_server_1.ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => ({
            store: new types_1.Store(db),
        }),
        context: ({ req }) => { },
    });
    server
        .listen({ port: 4000 })
        .then(({ url }) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`🚀  Server ready at ${url}, you get it!!!`);
    }))
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db.$disconnect();
    }));
});
main();
//# sourceMappingURL=index.js.map
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
exports.create = exports.getHeros = void 0;
const uuid_1 = require("uuid");
const getHeros = ({ context }) => __awaiter(void 0, void 0, void 0, function* () {
    return yield context.dataSources.store.prisma.hero.findMany();
});
exports.getHeros = getHeros;
const create = ({ args, context, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = args;
    let newHero = {
        id: (0, uuid_1.v1)(),
        name: name,
        multiverse: (0, uuid_1.v1)(),
    };
    const attributes = yield context.dataSources.store.prisma.attribute.findMany();
    let result = yield context.dataSources.store.prisma.hero.create({
        data: newHero,
    });
    yield context.dataSources.store.prisma.heroAttribute.create({
        data: {
            heroId: result.id,
            attributeId: attributes[Math.floor(Math.random() * attributes.length)].id,
        },
    });
    result = yield context.dataSources.store.prisma.hero.findUnique({
        where: {
            id: result.id,
        },
        include: {
            attributes: true,
        },
    });
    console.log(result);
    return result;
});
exports.create = create;
//# sourceMappingURL=HeroService.js.map
import { Hero } from ".prisma/client";
import { IResolverArgs } from "src/types";
import { v1 as uuidv1 } from "uuid";

export const getHeros = async ({ context }: IResolverArgs): Promise<Hero[]> => {
  return await context.dataSources.store.prisma.hero.findMany();
};

export const create = async ({
  args,
  context,
}: IResolverArgs): Promise<Hero> => {
  const { name } = args;
  let newHero: Hero = {
    name: name,
    multiverse: uuidv1(),
  };
  let result = await context.dataSources.store.prisma.hero.create({
    data: newHero,
  });
  return result;
};

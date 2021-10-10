import { Hero } from ".prisma/client";
import { IResolverArgs } from "src/types";

export const getHeros = async ({ context }: IResolverArgs): Promise<Hero[]> => {
  return context.dataSources.store.prisma.hero.findMany();
};

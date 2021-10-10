import { Attribute } from ".prisma/client";
import { IResolverArgs } from "src/types";

export const getAttributes = async ({
  context,
}: IResolverArgs): Promise<Attribute[]> => {
  return await context.dataSources.store.prisma.attribute.findMany();
};

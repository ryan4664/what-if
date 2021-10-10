import { PrismaClient } from "@prisma/client";
import { v1 as uuidv1 } from "uuid";

const prisma = new PrismaClient();

async function main() {
  [...Array(10)].map(async (x) => {
    await prisma.hero.create({
      data: {
        multiverse: uuidv1(),
      },
    });
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

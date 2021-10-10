import { PrismaClient } from "@prisma/client";
import { v1 as uuidv1 } from "uuid";

const prisma = new PrismaClient();

async function main() {
  [1,2,3,4,5,6].map(async (x) => {
    await prisma.hero.create({
      data: {
        multiverse: uuidv1(),
        name: `Hero-${x}`
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

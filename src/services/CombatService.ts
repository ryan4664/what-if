import { PrismaClient } from "@prisma/client";
import { HeroService } from "./HeroService";
// import { v1 as uuidv1 } from 'uuid'

export class CombatService {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public oneOnOnePVP = async ({ heroOneId, heroTwoId }): Promise<any> => {
    const heroService = new HeroService(this.prisma);

    const heroOne = await heroService.getHero(heroOneId);
    const heroTwo = await heroService.getHero(heroTwoId);

    if (!heroOne || !heroTwo) {
      throw new Error("Unable to find both heros, exiting combat");
    }

    // Start Combat
    // Store result

    // Would be cool to use websockets here to send updates to the UI
    // so a use could "watch" combat

    return;
  };
}

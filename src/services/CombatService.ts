import { Attribute, Hero, PrismaClient } from '@prisma/client'
import { Random } from 'random-js'
import { HeroService } from './HeroService'

export class CombatService {
  prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  public oneOnOnePVP = async ({ heroOneId, heroTwoId }): Promise<any> => {
    const heroService = new HeroService(this.prisma)

    const heroOne = await heroService.findById(heroOneId)
    const heroTwo = await heroService.findById(heroTwoId)

    if (!heroOne || !heroTwo) {
      throw new Error('Unable to find both heros, exiting combat')
    }

    const battleLog: any[] = []

    const random = new Random()
    let fightIsActive = true
    let heroOneHealth = heroOne.currentHealth
    let heroTwoHealth = heroTwo.currentHealth
    let playerOneWins = false
    let playerTwoWins = false

    while (fightIsActive) {
      const heroOneRoll = random.integer(0, 9)
      const heroTwoRoll = random.integer(10, 1000)

      const heroOneAttribute =
        heroOne.heroAttributes[
          random.integer(0, heroOne.heroAttributes.length - 1)
        ].attriubute

      const heroTwoAttribute =
        heroTwo.heroAttributes[
          random.integer(0, heroTwo.heroAttributes.length - 1)
        ].attriubute

      if (heroOneRoll > heroTwoRoll) {
        const attackResult = this.attack(
          heroOne,
          heroOneHealth,
          heroOneAttribute,
          heroTwo,
          heroTwoHealth,
          heroTwoAttribute
        )

        battleLog.push(attackResult.result)

        if (attackResult.attackerRemainingHealth === 0) {
          playerTwoWins = true
        } else if (attackResult.defenderRemainingHealth === 0) {
          playerOneWins = true
        }
      } else if (heroOneRoll < heroTwoRoll) {
        const attackResult = this.attack(
          heroTwo,
          heroTwoHealth,
          heroTwoAttribute,
          heroOne,
          heroOneHealth,
          heroOneAttribute
        )

        battleLog.push(attackResult.result)

        if (attackResult.attackerRemainingHealth === 0) {
          playerOneWins = true
        } else if (attackResult.defenderRemainingHealth === 0) {
          playerTwoWins = true
        }
      } else {
        battleLog.push({ result: 'draw' })
        fightIsActive = false
      }

      if (playerOneWins || playerTwoWins) {
        fightIsActive = false
      }
    }

    let winningHeroId: string | null = null
    let losingHeroId: string | null = null

    if (playerOneWins) {
      winningHeroId = heroOne.id
      losingHeroId = heroTwo.id
    } else if (playerTwoWins) {
      winningHeroId = heroTwo.id
      losingHeroId = heroOne.id
    }

    return {
      heroOneId: heroOne.id,
      heroTwoId: heroTwo.id,
      winningHeroId,
      losingHeroId,
      isDraw: winningHeroId === null,
      log: battleLog
    }

    // await this.prisma.playerVsPlayerCombatResult.create({
    //   data: {
    //     heroOneId: heroOne.id,
    //     heroTwoId: heroTwo.id,
    //     winningHeroId,
    //     losingHeroId,
    //     isDraw: winningHeroId === null,
    //     log: battleLog
    //   }
    // })

    // const experienceService = new ExperienceService(this.prisma)

    // Would be cool to use websockets here to send updates to the UI
    // so a use could "watch" combat
  }

  private attack = (
    attacker: Hero,
    attackerHealth: number,
    attackerAttribute: Attribute,
    defender: Hero,
    defenderHealth: number,
    defenderAttribute: Attribute
  ) => {
    defenderHealth = defenderHealth - attackerAttribute.baseDamage

    defenderHealth = defenderHealth > 0 ? defenderHealth : 0

    let result = [
      {
        attackingHero: attacker.name,
        damageDone: attackerAttribute.baseDamage,
        defenderRemainingHealth: defenderHealth
      }
    ]

    if (defenderHealth > 0) {
      attackerHealth = attackerHealth - defenderAttribute.baseDamage
      attackerHealth = attackerHealth > 0 ? attackerHealth : 0
      result.push({
        attackingHero: defender.name,
        damageDone: defenderAttribute.baseDamage,
        defenderRemainingHealth: attackerHealth
      })
    }

    return {
      attackerRemainingHealth: attackerHealth,
      defenderRemainingHealth: defenderHealth,
      result
    }
  }
}

import { Prisma, PrismaClient, Villain } from '@prisma/client'
import { v1 as uuidv1 } from 'uuid'

export class VillainService {
	prisma: PrismaClient

	constructor(prisma: PrismaClient) {
		this.prisma = prisma
	}

	public get = async (villanIds?: string[]): Promise<Villain[]> => {
		let arg = {
			include: {
				villainAttributes: {
					include: {
						attribute: true
					}
				}
			},
			where: {}
		}

		if (villanIds?.length) {
			arg.where = {
				id: {
					in: villanIds
				}
			}
		}

		const results = await this.prisma.villain.findMany(arg)

		return results.map((x) => ({
			...x
		}))
	}

	public findById = async (heroId: string) => {
		return this.prisma.villain.findUnique({
			where: {
				id: heroId
			},
			include: {
				villainAttributes: {
					include: {
						attribute: true
					}
				}
			}
		})
	}

	// Should villains always belong to the system?
	public create = async ({
													 name
												 }: {
		name: string
	}): Promise<Villain> => {
		const attributes = await this.prisma.attribute.findMany()

		const newVillain: Prisma.VillainCreateInput = {
			name: name,
			homeMultiverse: uuidv1(),
			villainAttributes: {
				create: [
					{
						attributeId:
						attributes[Math.floor(Math.random() * attributes.length)].id
					}
				]
			}
		}

		return this.prisma.hero.create({
			data: newVillain
		})
	}

	public unlockVillain = async (): Promise<Villain> => {
		// need a list of names somewhere?
		return await this.create({name: uuidv1()})
	}
}

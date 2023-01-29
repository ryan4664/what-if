import { Attribute, PrismaClient } from '.prisma/client'

export class AttributeService {
	prisma: PrismaClient

	constructor(prisma: PrismaClient) {
		this.prisma = prisma
	}

	public getAttributes = async (): Promise<Attribute[]> => {
		return this.prisma.attribute.findMany()
	}
}

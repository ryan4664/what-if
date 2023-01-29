import { Attribute, Hero, HeroAttribute, PrismaClient } from '@prisma/client'
import { DataSource } from 'apollo-datasource'

export class Store extends DataSource {
	prisma: PrismaClient

	context: Object

	cache: Object

	constructor(db: PrismaClient) {
		super()
		this.prisma = db
	}

	initialize(config) {
		this.context = config.context
		this.cache = config.cache
	}
}

export interface IResolverArgs {
	parent: any
	args: any
	context: {
		dataSources: {
			store: Store
		}
	}
	info: any
}

export interface IContextUser {
	userId: string
}

export interface IApolloContext {
	user?: IContextUser
	dataSources: {
		store: Store
	}
}

export enum LevelType {
	User = 1,
	Hero = 2
}

export interface HeroWithAttributes extends Hero {
	heroAttributes: (HeroAttribute & {
		attribute: Attribute
	})[]
}

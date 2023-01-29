import { Factory } from 'fishery'
import { v4 as uuidv4 } from 'uuid'
import { Random } from 'random-js'
import { Watcher } from "@prisma/client"

const random = new Random()

export default Factory.define<Watcher>(() => ({
	id: uuidv4(),
	timeShards: random.integer(0, 10000)
}))

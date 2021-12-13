import { User } from '.prisma/client'
import { Factory } from 'fishery'
import { v4 as uuidv4 } from 'uuid'
import { Random } from 'random-js'

const random = new Random()

export default Factory.define<User>(() => ({
  id: uuidv4(),
  emailAddress: random.string(10),
  password: random.string(10),
  timeShards: random.integer(0, 100),
  currentLevel: 1,
  currentExperience: 0
}))

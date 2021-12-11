import { Hero } from '.prisma/client'
import { Factory } from 'fishery'
import { v4 as uuidv4 } from 'uuid'

// @ts-ignore
export default Factory.define<Hero>(() => ({
  id: uuidv4(),
  multiverse: uuidv4(),
  name: uuidv4(),
  userId: uuidv4(),
  currentLevel: 1,
  currentExperience: 0,
  totalHealth: 100,
  currentHealth: 100,
  speed: 100,
  speach: 100,
  user: null
}))

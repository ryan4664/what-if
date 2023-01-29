import { Factory } from 'fishery'
import { Random } from 'random-js'
import { HeroWithAttributes } from 'src/types'
import { v4 as uuidv4 } from 'uuid'

const random = new Random()

export default Factory.define<HeroWithAttributes>(() => {
	const heroId = uuidv4()
	const attributeId = uuidv4()

	return {
		id: heroId,
		homeMultiverse: uuidv4(),
		name: uuidv4(),
		userId: uuidv4(),
		currentLevel: 1,
		currentExperience: 0,
		totalHealth: 20,
		currentHealth: 20,
		speed: 100,
		speech: 100,
		user: null,
		heroAttributes: [
			{
				id: uuidv4(),
				attributeId: attributeId,
				heroId: heroId,
				attribute: {
					id: uuidv4(),
					name: random.string(5),
					baseDamage: random.integer(1, 100)
				}
			}
		]
	}
})

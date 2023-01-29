import jwt from 'jsonwebtoken'
import { IContextUser } from 'src/types'

export const validateToken = (token: string): IContextUser => {
	try {
		const result = jwt.verify(token, 'someKey')

		return {
			// @ts-ignore
			userId: result.userId
		}
	} catch (error) {
		throw new Error('Invalid token')
	}
}

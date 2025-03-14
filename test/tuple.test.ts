import { describe, it } from 'bun:test'
import { isEqual } from './utils'

import { t } from 'elysia'

describe('Tuple', () => {
	it('handle tuple', () => {
		const shape = t.Tuple([t.String(), t.Number()])

		const value = ['saltyaom', 123] satisfies typeof shape.static

		isEqual(shape, value)
	})

	it('handle tuple object', () => {
		const shape = t.Tuple([
			t.String(),
			t.Object({
				name: t.String(),
				age: t.Number()
			})
		])

		const value = [
			'a',
			{
				name: 'saltyaom',
				age: 123
			}
		] satisfies typeof shape.static

		isEqual(shape, value)
	})

	it('handle nested tuple', () => {
		const shape = t.Tuple([t.String(), t.Tuple([t.String(), t.Number()])])

		const value = ['a', ['b', 123]] satisfies typeof shape.static

		isEqual(shape, value)
	})
})

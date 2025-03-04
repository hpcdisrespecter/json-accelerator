import { t } from 'elysia'
import { type TAnySchema } from '@sinclair/typebox'
import { createAccelerator } from '../src'

import { describe, expect, it } from 'bun:test'

const isEqual = (shape: TAnySchema, value: unknown, expected = value) =>
	expect(JSON.parse(createAccelerator(shape)(value))).toEqual(expected)

describe('Record', () => {
	it('handle record', () => {
		const shape = t.Record(t.String(), t.String())

		const value = {
			name: 'saltyaom',
			alias: 'saltyaom'
		} satisfies typeof shape.static

		isEqual(shape, value)
	})

	it('handle record object', () => {
		const shape = t.Record(
			t.String(),
			t.Object({
				name: t.String(),
				age: t.Number()
			})
		)

		const value = {
			saltyaom: {
				name: 'saltyaom',
				age: 23
			},
			chiffon: {
				name: 'chiffon',
				age: 24
			}
		} satisfies typeof shape.static

		isEqual(shape, value)
	})

	it('handle nested record', () => {
		const shape = t.Record(t.String(), t.Record(t.String(), t.Number()))

		const value = {
			saltyaom: {
				id: 1,
				age: 23
			},
			chiffon: {
				id: 2,
				age: 24
			}
		} satisfies typeof shape.static

		isEqual(shape, value)
	})

	it('handle unknown record', () => {
		const shape = t.Object(
			{},
			{
				patternProperties: {
					'^[a-z]+$': t.String()
				}
			}
		)

		const value = {
			name: 'saltyaom',
			alias: 'saltyaom',
			unknown: {
				a: 1,
				b: ['a', { hello: 'world' }]
			}
		} satisfies typeof shape.static

		isEqual(shape, value)
	})
})

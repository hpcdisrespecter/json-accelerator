import { describe, expect, it } from 'bun:test'
import { isEqual } from './utils'

import { t } from 'elysia'

import { createAccelerator } from '../src'

describe('Core', () => {
	it('handle string', () => {
		const shape = t.String()

		const value = 'saltyaom' satisfies typeof shape.static

		isEqual(shape, value)
	})

	it('handle number', () => {
		const shape = t.Number()

		const value = 0 satisfies typeof shape.static

		isEqual(shape, value)
	})

	it('handle boolean', () => {
		const shape = t.Boolean()

		const value = true satisfies typeof shape.static

		isEqual(shape, value)
	})

	it('handle literal', () => {
		const shape = t.Literal('saltyaom')

		const value = 'saltyaom' satisfies typeof shape.static

		isEqual(shape, value)
	})

	it('handle null', () => {
		const shape = t.Null()

		const value = null satisfies typeof shape.static

		isEqual(shape, value)
	})

	it('handle undefined', () => {
		const shape = t.Undefined()

		const value = undefined satisfies typeof shape.static

		expect(createAccelerator(shape)(value)).toBe('')
	})

	it('handle date', () => {
		const shape = t.Date()

		const value = new Date() satisfies typeof shape.static

		expect(createAccelerator(shape)(value)).toBe(`"${value.toISOString()}"`)
	})

	it('handle date timestamp', () => {
		const shape = t.Date()

		const value = Date.now()

		isEqual(shape, value)
	})

	it('handle nullable date', () => {
		const shape = t.Nullable(t.Date())

		const value = new Date() satisfies typeof shape.static
		expect(createAccelerator(shape)(value)).toBe(`"${value.toISOString()}"`)

		const value2 = null satisfies typeof shape.static
		isEqual(shape, value2)
	})

	it('handle nullable date timestamp', () => {
		const shape = t.Nullable(t.Date())

		const value = 2
		isEqual(shape, value)

		const value2 = null satisfies typeof shape.static
		isEqual(shape, value2)
	})

	it('handle integer', () => {
		const shape = t.Integer()

		const value = 2.2 satisfies typeof shape.static

		isEqual(shape, value)
	})

	it('handle bigint', () => {
		const shape = t.BigInt()

		const value = BigInt(2) satisfies typeof shape.static

		isEqual(shape, +(value + ''))
	})

	it('handle object', () => {
		const shape = t.Object({
			name: t.String(),
			id: t.Number()
		})

		const value = {
			id: 0,
			name: 'saltyaom'
		} satisfies typeof shape.static

		isEqual(shape, value)
	})

	it('handle string array', () => {
		const shape = t.Object({
			name: t.String(),
			games: t.Array(t.String())
		})

		const value = {
			name: 'saltyaom',
			games: ['MiSide', 'Strinova']
		} satisfies typeof shape.static

		isEqual(shape, value)
	})

	it('handle number array', () => {
		const shape = t.Object({
			name: t.String(),
			games: t.Array(t.Number())
		})

		const value = {
			name: 'saltyaom',
			games: [1, 2, 3]
		} satisfies typeof shape.static

		isEqual(shape, value)
	})

	it('handle boolean array', () => {
		const shape = t.Object({
			name: t.String(),
			games: t.Array(t.Boolean())
		})

		const value = {
			name: 'saltyaom',
			games: [true, false, true]
		} satisfies typeof shape.static

		isEqual(shape, value)
	})

	it('handle object array', () => {
		const shape = t.Object({
			name: t.String(),
			games: t.Array(
				t.Object({
					name: t.String(),
					hoursPlay: t.Number({ default: 0 }),
					tags: t.Array(t.String())
				})
			)
		})

		const value = {
			name: 'saltyaom',
			games: [
				{
					name: 'MiSide',
					hoursPlay: 17,
					tags: ['Psychological Horror', 'Cute', 'Dating Sim']
				},
				{
					name: 'Strinova',
					hoursPlay: 365,
					tags: ['Free to Play', 'Anime', 'Third-Person Shooter']
				},
				{
					name: "Tom Clancy's Rainbow Six Siege",
					hoursPlay: 287,
					tags: ['FPS', 'Multiplayer', 'Tactical']
				}
			]
		} satisfies typeof shape.static

		isEqual(shape, value)
	})

	it('handle optional', () => {
		const shape = t.Object({
			name: t.String(),
			playing: t.Optional(t.String())
		})

		const value = {
			name: 'saltyaom'
		} satisfies typeof shape.static

		isEqual(shape, value)
	})

	it('handle nullable', () => {
		const shape = t.Object({
			name: t.String(),
			country: t.Nullable(t.String())
		})

		const value = {
			name: 'saltyaom',
			country: null
		} satisfies typeof shape.static

		isEqual(shape, value)
	})

	it('handle undefinable', () => {
		const shape = t.Object({
			name: t.String(),
			country: t.MaybeEmpty(t.String())
		})

		const value = {
			name: 'saltyaom',
			// Transform undefined to null
			country: null
		} satisfies typeof shape.static

		isEqual(shape, value)
	})

	it('handle intersect', () => {
		const shape = t.Intersect([
			t.Object({
				name: t.String(),
				playing: t.Optional(t.String())
			}),
			t.Object({
				country: t.String()
			})
		])

		const value = {
			name: 'saltyaom',
			country: 'Thailand'
		} satisfies typeof shape.static

		isEqual(shape, value)
	})

	it('handle union', () => {
		const shape = t.Union([
			t.Object({
				name: t.String(),
				playing: t.Optional(t.String())
			}),
			t.Object({
				country: t.String()
			})
		])

		const value = {
			name: 'saltyaom',
			playing: 'MiSide'
		} satisfies typeof shape.static

		isEqual(shape, value)
	})

	it('handle union with nullable', () => {
		const shape = t.Union([
			t.Object({
				name: t.String(),
				playing: t.Optional(t.String())
			}),
			t.Object({
				country: t.Nullable(t.String())
			})
		])

		const value = {
			country: null
		} satisfies typeof shape.static

		isEqual(shape, value)
	})

	it('handle additionalProperties', () => {
		const shape = t.Object(
			{
				name: t.String(),
				playing: t.Optional(t.String())
			},
			{
				additionalProperties: true
			}
		)

		const value = {
			name: 'saltyaom',
			playing: 'Strinova'
		} satisfies typeof shape.static

		isEqual(shape, value)
	})

	it('handle nullable array', () => {
		const shape = t.Object({
			name: t.String(),
			games: t.Nullable(t.Array(t.String()))
		})

		const value = {
			name: 'saltyaom',
			games: null
		} satisfies typeof shape.static

		isEqual(shape, value)
	})

	it('handle nullable object', () => {
		const shape = t.Object({
			name: t.String(),
			metadata: t.Nullable(
				t.Object({
					alias: t.String()
				})
			)
		})

		const value = {
			name: 'saltyaom',
			metadata: null
		} satisfies typeof shape.static

		isEqual(shape, value)
	})
})

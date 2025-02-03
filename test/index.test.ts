import { t } from 'elysia'
import { type TAnySchema } from '@sinclair/typebox'
import { createAccelerator } from '../src'

import { describe, expect, it } from 'bun:test'

const isEqual = (shape: TAnySchema, value: unknown) =>
	expect(JSON.parse(createAccelerator(shape)(value))).toEqual(value)

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

	it('handle complex object', () => {
		const shape = t.Object({
			id: t.Number(),
			name: t.Literal('SaltyAom'),
			bio: t.String(),
			user: t.Object({
				name: t.String(),
				password: t.String()
			}),
			playing: t.Optional(t.String()),
			games: t.Array(
				t.Object({
					name: t.String(),
					hoursPlay: t.Number({ default: 0 }),
					tags: t.Array(t.String())
				})
			),
			metadata: t.Intersect([
				t.Object({
					alias: t.String()
				}),
				t.Object({
					country: t.Nullable(t.String())
				})
			]),
			social: t.Optional(
				t.Object({
					facebook: t.Optional(t.String()),
					twitter: t.Optional(t.String()),
					youtube: t.Optional(t.String())
				})
			)
		})

		const value = {
			id: 1,
			name: 'SaltyAom',
			bio: 'I like train',
			user: {
				name: 'SaltyAom',
				password: '123456'
			},
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
			],
			metadata: {
				alias: 'SaltyAom',
				country: 'Thailand'
			},
			social: {
				twitter: 'SaltyAom'
			}
		} satisfies typeof shape.static

		isEqual(shape, value)
	})

	it('handle complex array', () => {
		const shape = t.Array(
			t.Object({
				id: t.Number(),
				name: t.String(),
				bio: t.String(),
				user: t.Object({
					name: t.String(),
					password: t.String()
				}),
				playing: t.Optional(t.String()),
				games: t.Array(
					t.Object({
						name: t.String(),
						hoursPlay: t.Number({ default: 0 }),
						tags: t.Array(t.String())
					})
				),
				metadata: t.Intersect([
					t.Object({
						alias: t.String()
					}),
					t.Object({
						country: t.Nullable(t.String())
					})
				]),
				social: t.Optional(
					t.Object({
						facebook: t.Optional(t.String()),
						twitter: t.Optional(t.String()),
						youtube: t.Optional(t.String())
					})
				)
			})
		)

		const value = [
			{
				id: 1,
				name: 'SaltyAom',
				bio: 'I like train',
				user: {
					name: 'SaltyAom',
					password: '123456'
				},
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
				],
				metadata: {
					alias: 'SaltyAom',
					country: 'Thailand'
				},
				social: {
					twitter: 'SaltyAom'
				}
			},
			{
				id: 1,
				name: 'VLost',
				bio: 'ไม่พี่คืองี้',
				user: {
					name: 'vlost',
					password: '123456'
				},
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
				],
				metadata: {
					alias: 'nattapon_kub',
					country: 'Thailand'
				}
			}
		] satisfies typeof shape.static

		isEqual(shape, value)
	})
})

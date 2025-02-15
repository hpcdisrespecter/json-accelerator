import { t } from 'elysia'
import { type TAnySchema } from '@sinclair/typebox'
import { createAccelerator } from '../src'

import { describe, expect, it } from 'bun:test'

const isEqual = (shape: TAnySchema, value: unknown) =>
	expect(JSON.parse(createAccelerator(shape)(value))).toEqual(value)

describe('sanitize throw', () => {
	it('throw on invalid value', () => {
		const shape = t.Object({
			a: t.String(),
			b: t.String()
		})

		const value = {
			a: 'hello',
			b: 'hello\nworld'
		} satisfies typeof shape.static

		expect(() =>
			createAccelerator(shape, {
				sanitize: 'throw'
			})(value)
		).toThrow()
	})

	it("don't throw on valid value", () => {
		const shape = t.Object({
			a: t.String(),
			b: t.String()
		})

		const value = {
			a: 'hello',
			b: 'hello world'
		} satisfies typeof shape.static

		expect(() =>
			createAccelerator(shape, {
				sanitize: 'throw'
			})(value)
		).not.toThrow()

		isEqual(shape, value)
	})

	it("don't throw on valid value", () => {
		const shape = t.Object({
			a: t.String(),
			b: t.String({
				sanitize: true
			})
		})

		const value = {
			a: 'hello',
			b: 'hello world'
		} satisfies typeof shape.static

		expect(() =>
			createAccelerator(shape, {
				sanitize: 'throw'
			})(value)
		).not.toThrow()

		isEqual(shape, value)
	})

	it('handle sanitize value', () => {
		const shape = t.Object({
			a: t.String(),
			b: t.String({
				sanitize: true
			})
		})

		const value = {
			a: 'hello',
			b: 'hello\nworld'
		} satisfies typeof shape.static

		expect(() =>
			createAccelerator(shape, {
				sanitize: 'throw'
			})(value)
		).not.toThrow()

		isEqual(shape, value)
	})
})

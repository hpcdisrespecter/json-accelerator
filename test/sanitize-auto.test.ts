import { t } from 'elysia'
import { type TAnySchema } from '@sinclair/typebox'
import { createAccelerator } from '../src'

import { describe, expect, it } from 'bun:test'

const isEqual = (shape: TAnySchema, value: unknown) =>
	expect(JSON.parse(createAccelerator(shape)(value))).toEqual(value)

describe('sanitize auto', () => {
	it('sanitize invalid value', () => {
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
				sanitize: 'auto'
			})(value)
		).not.toThrow()

		expect(() =>
			JSON.parse(
				createAccelerator(shape, {
					sanitize: 'auto'
				})(value)
			)
		).not.toThrow()

		expect(
			createAccelerator(shape, {
				sanitize: 'auto'
			})(value)
		).toEqual(`{"a":"hello","b":"hello\\nworld"}`)
	})

	it('create literal value', () => {
		const shape = t.Object({
			a: t.String(),
			b: t.Literal('SaltyAom')
		})

		const value = {
			a: 'hello',
			b: 'SaltyAom'
		} satisfies typeof shape.static

		expect(() =>
			createAccelerator(shape, {
				sanitize: 'auto'
			})(value)
		).not.toThrow()

		isEqual(shape, value)
	})
})

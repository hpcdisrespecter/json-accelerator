import { type TAnySchema } from '@sinclair/typebox'
import { createAccelerator } from '../src'

import { expect } from 'bun:test'

export const isEqual = (shape: TAnySchema, value: unknown, expected = value) =>
	expect(JSON.parse(createAccelerator(shape)(value))).toEqual(expected)

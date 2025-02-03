import { bench, run, barplot, summary, compact } from 'mitata'

import { createAccelerator } from '../src'
import fastJson from 'fast-json-stringify'
import type { TAnySchema } from '@sinclair/typebox'

export const benchmark = <T extends TAnySchema>(
	model: T,
	value: T['static']
) => {
	const fastJsonStringify = fastJson(model)
	const encode = createAccelerator(model)

	if (encode(value) !== JSON.stringify(value)) {
		console.log(encode(value))
		throw new Error('Invalid result')
	}

	if (process.env.DEBUG) console.log(encode.toString())

	compact(() => {
		barplot(() => {
			summary(() => {
				bench('JSON Stingify', () => {
					return JSON.stringify(value)
				})

				bench('Fast Json Stringify', () => {
					return fastJsonStringify(value)
				})

				bench('JSON Accelerator', () => {
					return encode(value)
				})
			})
		})
	})

	run()
}

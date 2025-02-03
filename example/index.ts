import { t } from 'elysia'
import { createAccelerator } from '../src/index'

const shape = t.Object({
	name: t.String(),
	id: t.Number()
})

const value = {
	id: 0,
	name: 'saltyaom'
} satisfies typeof shape.static

const stringify = createAccelerator(shape)

console.log(stringify(value))

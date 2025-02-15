import { t } from 'elysia'
import { createAccelerator } from '../src/index'

const shape = t.Object({
	name: t.String(),
	playing: t.Nullable(t.String())
})

const value = {
	name: 'saltyaom',
	playing: null
} satisfies typeof shape.static

const stringify = createAccelerator(shape)

console.log(stringify(value))
// console.log(stringify.toString())

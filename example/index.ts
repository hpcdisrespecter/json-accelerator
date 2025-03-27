import { t } from 'elysia'
import { createAccelerator } from '../src/index'

const shape = t.Object({
	name: t.String(),
	playing: t.Nullable(t.Integer({ default: 1 }))
})

console.log(t.Optional(t.String()))

const value = {
	name: 'saltyaom',
	playing: null
} satisfies typeof shape.static

const mirror = createAccelerator(shape)

console.log(mirror(value))

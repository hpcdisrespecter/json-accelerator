import { t } from 'elysia'
import { createAccelerator } from '../src/index'

const shape = t.Object({
	message: t.String({
		trusted: true
	})
})

const value = {
	message: 'a'
} satisfies typeof shape.static

const mirror = createAccelerator(shape)

console.log(mirror(value))

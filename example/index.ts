import { t } from 'elysia'
import { createAccelerator } from '../src/index'

const shape = t.Record(
	t.String(),
	t.Object({
		a: t.String(),
		b: t.String()
	})
)

const value = {
	a: { a: 'a', b: 'a' },
	c: { a: 'a', b: 'b' }
} satisfies typeof shape.static

const stringify = createAccelerator(shape)

console.log(stringify(value))
// console.log(stringify.toString())

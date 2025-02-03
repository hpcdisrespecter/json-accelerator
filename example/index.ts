import { t } from 'elysia'
import { createAccelerator } from '../src/index'

const shape = t.Object({
	a: t.Array(t.Number())
	// a: t.Literal('a'),
	// b: t.Number(),
	// c: t.Object({
	// 	a: t.String()
	// }),
	// d: t.Array(
	// 	t.Object({
	// 		a: t.Array(t.String())
	// 	})
	// ),
	// e: t.Intersect([
	// 	t.Object({
	// 		a: t.String()
	// 	}),
	// 	t.Object({
	// 		b: t.Optional(t.Number())
	// 	})
	// ])
})

const stringify = createAccelerator(shape)

console.log(
	stringify({
		a: [1, 2],
		b: 1,
		c: { a: 'a' },
		d: [{ a: ['a', 'b'] }, { a: ['a', 'a'] }],
		e: { a: 'a' }
	} satisfies typeof shape.static)
)

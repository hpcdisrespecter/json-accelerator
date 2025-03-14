import { t } from 'elysia'
import { createAccelerator } from '../src/index'

const v = t.Module({
	a: t.Object({
		name: t.String(),
		job: t.Optional(t.Ref('job')),
		trait: t.Optional(t.String())
	}),
	job: t.Number()
})

const shape = v.Import('a')

const value = {
	name: 'Jane Doe',
	job: 'Software Engineer',
	trait: 'Friendly'
} satisfies typeof shape.static

const mirror = createAccelerator(shape)

console.log(mirror(value))

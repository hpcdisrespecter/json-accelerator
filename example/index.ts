import { t } from 'elysia'
import { createAccelerator } from '../src/index'

const shape = t.Object({ a: t.Date() })

const value = { a: new Date() } satisfies typeof shape.static

const stringify = createAccelerator(shape)

console.log(stringify(value))

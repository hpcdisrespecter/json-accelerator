import { t } from 'elysia'
import { createAccelerator } from '../src/index'

const shape = t.Array(t.Number())

const value = [1,2] satisfies typeof shape.static

const stringify = createAccelerator(shape)

console.log(stringify(value))
// console.log(stringify.toString())

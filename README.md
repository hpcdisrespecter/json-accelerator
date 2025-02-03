# JSON Accelerator

Accelerate JSON stringification by providing OpenAPI/TypeBox model

## Installation

```bash
bun add json-accelerator
```

## Usage

It is expected to use [https://github.com/sinclairzx81/typebox](TypeBox) to define the schema, but and OpenAPI schema should also work.

```typescript
import { Type as t } from '@sinclair/typebox'
import { createAccelerator } from 'json-accelerator'

const shape = t.Object({
	name: t.String(),
	id: t.Number()
})

const value = {
	id: 0,
	name: 'saltyaom'
} satisfies typeof shape.static

const encode = createAccelerator(shape)

console.log(encode(value)) // {"id":0,"name":"saltyaom"}
```

## Caveat

This library **WILL NOT** check for the validity of the schema, it is expected that the schema is **always** correct.

This can be achieved by checking the input validity with TypeBox before passing it to the accelerator.

```typescript
import { Type as t } from '@sinclair/typebox'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { createAccelerator } from 'json-accelerator'

const shape = t.Object({
	name: t.String(),
	id: t.Number()
})

const value = {
	id: 0,
	name: 'saltyaom'
}

const guard = TypeCompiler.Compile(shape)
const encode = createAccelerator(shape)

if(guard.Check(value))
	encode(value)
```

If the shape is incorrect, the output will try to corece the value into an expected model but if failed the error will be thrown.

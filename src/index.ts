import type { TAnySchema } from '@sinclair/typebox'

const Kind = Symbol.for('TypeBox.Kind')
const OptionalKind = Symbol.for('TypeBox.Optional')

const isSpecialProperty = (name: string): boolean => /(\ |-|\t|\n)/.test(name)

const joinProperty = (v1: string, v2: string): string => {
	if (isSpecialProperty(v2)) return `${v1}["${v2}"]`

	return `${v1}.${v2}`
}

const encodeProperty = (v: string): string => `"${v}"`

const getMetadata = (schema: TAnySchema) => {
	let isNullable = false
	let isUndefinable = false
	let newSchema

	if (!schema.anyOf || (Kind in schema && schema[Kind] !== 'Union'))
		return {
			schema,
			isNullable,
			isUndefinable
		}

	for (const type of schema.anyOf) {
		if (type.type === 'null') {
			isNullable = true
			continue
		}

		if (type.type === 'undefined') {
			isUndefinable = true
			continue
		}

		if (!newSchema) {
			newSchema = type
			continue
		}

		return {
			schema,
			isNullable,
			isUndefinable
		}
	}

	return {
		schema: newSchema,
		isNullable,
		isUndefinable
	}
}

export const mergeObjectIntersection = (schema: TAnySchema): TAnySchema => {
	if (
		!schema.allOf ||
		(Kind in schema &&
			(schema[Kind] !== 'Intersect' || schema.type !== 'object'))
	)
		return schema

	const { allOf, ...newSchema } = schema
	newSchema.properties = {}

	if (Kind in newSchema) newSchema[Kind as any] = 'Object'

	for (const type of allOf) {
		if (type.type !== 'object') continue

		const { properties, required, type: _, [Kind]: __, ...rest } = type

		if (required)
			newSchema.required = newSchema.required
				? newSchema.required.concat(required)
				: required

		Object.assign(newSchema, rest)

		for (const property in type.properties)
			newSchema.properties[property] = mergeObjectIntersection(
				type.properties[property]
			)
	}

	return newSchema
}

interface Instruction {
	array: number
	optional: number
	properties: string[]
}

const accelerate = (
	schema: TAnySchema,
	property: string,
	instruction: Instruction
): string => {
	if (!schema) return ''

	let v = ''
	const isRoot = property === 'v'

	const { schema: newSchema, isNullable, isUndefinable } = getMetadata(schema)
	schema = newSchema

	// const error = '' // `??(()=>{throw new Error("Property '${property}' is missing")})()`

	const nullableCondition =
		isNullable && isUndefinable
			? `${property}===null||${property}===undefined`
			: isNullable
				? `${property}===null`
				: isUndefinable
					? `${property}===undefined`
					: ''

	switch (schema.type) {
		case 'string':
			if (isNullable || isUndefinable)
				v = `\${${nullableCondition}?null:\`\\"\${${property}}\\"\`}`
			else v = `\"\${${property}}\"`
			break

		case 'number':
		case 'boolean':
			if (nullableCondition) v = `\${${property}??null}`
			else v = `\${${property}}`
			break

		case 'null':
			v = `\${${property}}`
			break

		case 'undefined':
			break

		case 'object':
			if (nullableCondition) v += `\${${nullableCondition}?null:\``

			v += '{'

			if (schema.additionalProperties) {
				v = `$\{JSON.stringify(${property})}`
				break
			}

			schema = mergeObjectIntersection(schema)

			let init = true
			let hasOptional = false
			let op = `op[${instruction.optional}]`

			for (const key in schema.properties)
				if (OptionalKind in schema.properties[key]) {
					instruction.optional++
					hasOptional = true
					break
				}

			for (const key in schema.properties) {
				const isOptional = OptionalKind in schema.properties[key]
				const name = joinProperty(property, key)
				const hasShortName =
					schema.properties[key].type === 'object' &&
					!name.startsWith('ar')

				const i = instruction.properties.length
				if (hasShortName) instruction.properties.push(name)

				const k = encodeProperty(key)
				const p = accelerate(
					schema.properties[key],
					hasShortName ? `s${i}` : name,
					instruction
				)

				const comma = `\${${op}?',':(${op}=true)&&''}`

				v += isOptional
					? `\${(${name}!==undefined?\`${comma}${k}:${p}\`:'')}`
					: hasOptional
						? `${!init ? ',' : `\${(${op}=true)&&""}`}${k}:${p}`
						: `${!init ? ',' : ''}${k}:${p}`

				init = false
			}

			if (hasOptional) v += `\${(${op}=false)||''}`

			v += '}'

			if (nullableCondition) v += `\`}`

			break

		case 'array':
			const i = instruction.array

			instruction.array++

			if (schema.items.type === 'string') {
				if (nullableCondition)
					v += `\${${nullableCondition}?null:${property}.length?\`["$\{${property}.join('",\"')}"]\`:"[]"}`
				else
					v += `\${${property}.length?\`["$\{${property}.join('",\"')}"]\`:"[]"}`

				break
			}

			if (
				schema.items.type === 'number' ||
				schema.items.type === 'boolean'
			) {
				if (nullableCondition)
					v += `\${${nullableCondition}?null:${property}.length?\`[$\{${property}.join(',')}]\`:"[]"`
				else
					v += `\${${property}.length?\`[$\{${property}.join(',')}]\`:"[]"}`

				break
			}

			if (isNullable || isUndefinable) v += `\${!${property}?null:\``

			if (!isRoot) v += `\${(()=>{`

			v +=
				`const ar${i}s=${property};` +
				`let ar${i}v='[';` +
				`for(let i=0;i<ar${i}s.length;i++){` +
				`const ar${i}p=ar${i}s[i];` +
				`if(i!==0){ar${i}v+=','}` +
				`ar${i}v+=\`${accelerate(schema.items, `ar${i}p`, instruction)}\`` +
				`}` +
				`return ar${i}v+']'`

			if (!isRoot) v += `})()}`

			if (isNullable || isUndefinable) v += `\`}`

			break

		default:
			v = `$\{JSON.stringify(${property})}`

			break
	}

	if (!isRoot) return v

	const isArray = schema.type === 'array'
	if (!isArray) v = `\`${v}\``

	let setup = ''

	if (instruction.optional)
		setup += `let op=new Array(${instruction.optional})\n`

	for (let i = 0; i < instruction.properties.length; i++) {
		const key = `s${i}`
		if (i === 0) setup += 'const '
		else setup += ','
		setup += `${key}=${instruction.properties[i]}`
	}
	if (instruction.properties.length) setup += '\n'

	if (isArray) return setup + '\n' + v

	return setup + 'return ' + v
}

export const createAccelerator = <T extends TAnySchema>(
	schema: T
): ((v: T['static']) => string) => {
	const f = accelerate(schema, 'v', {
		array: 0,
		optional: 0,
		properties: []
	})

	return Function('v', f) as any
}

export default createAccelerator

// const shape = t.Object({
// 	a: t.Nullable(
// 		t.Object({
// 			a: t.String()
// 		})
// 	)
// })

// const shape = t.Object({
// 	a: t.String(),
// 	social: t.Optional(
// 		t.Object({
// 			facebook: t.Nullable(t.String()),
// 			twitter: t.Nullable(t.String()),
// 			youtube: t.Nullable(t.String())
// 		})
// 	)
// })

// const stringify = createaccelerate(shape)

// console.log(
// 	stringify({
// 		a: 'a',
// 		social: {
// 			a: 'a',
// 		}
// 	})
// )

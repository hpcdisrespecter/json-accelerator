import { t } from 'elysia'
import { benchmark } from './utils'

benchmark(
	t.Object({
		id: t.String({
			format: 'input'
		}),
		name: t.String()
	}),
	{
		id: '\n',
		name: 'SaltyAom'
	}
)

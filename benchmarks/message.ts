import { t } from 'elysia'
import { benchmark } from './utils'

benchmark(
	t.Object({
		message: t.String({
			trusted: true
		})
	}),
	{ message: 'Hello, World!' as const }
)

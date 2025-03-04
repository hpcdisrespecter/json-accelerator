# 0.1.1 - 4 Mar 2025
Feature:
- support Record

Improvement:
- add Tuple test case

# 0.1.0 - 5 Feb 2025
Feature:
- replace `arrayItems.join('",\"')` in favour of inline `joinStringArray` to improve performance
- add `sanitize` option for handling unsafe character
	- new behavior is `sanitize`, previously is equivalent to `manual`
- support inline a literal value

# 0.0.2 - 4 Feb 2025
Feature:
- support integer, bigint, date, datetime
- support `default` value for optional, and nullable on primitive type

Improvement:
- refactor properties instruction generation
- flatten optional properties to speed up runtime performance in Bun
- remove negate where possible in runtime
- use stringified null to prevent `toString()` call

Bug fix:
- `integer` is using `JSON.stringify`

# 0.0.1 - 3 Feb 2025
Bug fix:
- separate optional comma flag between closure

# 0.0.0 - 3 Feb 2025
Feature:
- initial release

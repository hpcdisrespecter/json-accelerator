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

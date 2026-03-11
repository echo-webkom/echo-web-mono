---
name: generate-mock
description: Use when the user asks to generate, regenerate, or update mocks for a Go interface. Trigger phrases include "generate mock", "regenerate mock", "update mock", "add mock", or when a new method is added to a port interface in apps/uno.
---

# Generate Mock

Mocks in `apps/uno` are generated using [mockery](https://github.com/vektra/mockery) based on the config in `apps/uno/.mockery.yaml`.

## Config

```yaml
packages:
  uno/domain/port:
    config:
      dir: "{{.InterfaceDir}}/mocks"
      pkgname: mocks
      filename: "{{.InterfaceName}}.go"
      structname: "{{.InterfaceName}}"
      all: true
```

All interfaces under `apps/uno/domain/port/` are mocked into `apps/uno/domain/port/mocks/`.

## How to regenerate mocks

Run from `apps/uno/`:

```bash
cd apps/uno && go run github.com/vektra/mockery/v2
```

Or with pnpm from the monorepo root:

```bash
pnpm --filter=uno mocks:generate
```

**IMPORTANT**: After adding or changing any method on an interface in `apps/uno/domain/port/`, always regenerate the mocks by running the command above rather than editing the mock files by hand. Hand-editing mocks is error-prone and will be overwritten on the next regeneration.

## When to run

- After adding a new method to any interface in `apps/uno/domain/port/`
- After updating, removing or renaming a method on such an interface
- After adding a new interface file to `apps/uno/domain/port/`

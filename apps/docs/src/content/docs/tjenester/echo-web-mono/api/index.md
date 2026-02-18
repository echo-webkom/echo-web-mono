---
title: Uno API Backend
description: echo sin backend API bygget i Go med Chi-router og hexagonal arkitektur.
---

`uno` er backend-applikasjonen i `echo-web-mono`. Den er skrevet i Go og brukes av web-applikasjonen og andre interne tjenester.

For et mer detaljert arkitekturdypdykk, se [Uno Arkitektur](/tjenester/echo-web-mono/api/arkitektur/).

## Teknologi

### Hovedteknologier

- **Go** - hovedspråk for backend
- **Chi** - HTTP routing
- **PostgreSQL** - vedvarende datalagring
- **sqlx** - databaseaksess
- **Swag** - Swagger/OpenAPI-generering

### Arkitektur

Uno følger en domeneorientert/hexagonal struktur:

- `domain/` - kjernelogikk, modeller og porter
- `http/` - router, routes, DTO-er og handlers
- `infrastructure/` - implementasjoner for database, logging og eksterne integrasjoner
- `bootstrap/` - kobler sammen avhengigheter
- `cmd/` - entrypoints (`web`, `cron`, `worker`)

## Struktur

```text
apps/uno/
├── bootstrap/           # Avhengighetsoppsett
├── cmd/
│   ├── web/             # HTTP API entrypoint
│   ├── cron/            # Cron jobs
│   └── worker/          # Bakgrunnsjobber
├── config/              # Miljø og konfigurasjon
├── domain/              # Domene, porter og services
├── http/                # Router, routes, handlers og DTO-er
├── infrastructure/      # Postgres, logging, telemetry, eksterne systemer
├── docs/                # Swagger/OpenAPI dokumentasjon
├── scripts/             # Nyttige scripts
└── testutil/            # Hjelpefunksjoner for tester
```

## Lokale kommandoer

Kjør fra rotmappen:

```bash
# Start uno i dev-modus
pnpm --filter=@echo-webkom/uno dev

# Kjør tester
pnpm --filter=@echo-webkom/uno test

# Tester med coverage
pnpm --filter=@echo-webkom/uno test:coverage

# Installer Go-verktøy (air, swag, mockery)
pnpm --filter=@echo-webkom/uno tools:install

# Generer swagger og mocks
pnpm --filter=@echo-webkom/uno swag:init
pnpm --filter=@echo-webkom/uno mocks:generate
```

## API og miljø

- API kjører lokalt på port `8000` (styrt av `UNO_API_PORT`)
- Web bruker typisk `NEXT_PUBLIC_API_URL=http://localhost:8000`
- Uno bruker PostgreSQL lokalt via Docker-oppsettet i monorepoet

## Vanlige oppgaver

### Legge til en ny route

1. Legg route i `apps/uno/http/routes/...`
2. Implementer handler i `apps/uno/http/handler/...`
3. Kall service-lag i `apps/uno/domain/service/...`
4. Implementer evt. ny port/adapter i `apps/uno/domain/port` og `apps/uno/infrastructure/...`

### Oppdatere API-dokumentasjon

```bash
pnpm --filter=@echo-webkom/uno swag:init
```

## Kilder

- `apps/uno/README.md`
- [Chi dokumentasjon](https://github.com/go-chi/chi)
- [sqlx dokumentasjon](https://github.com/jmoiron/sqlx)
- [Swag dokumentasjon](https://github.com/swaggo/swag)

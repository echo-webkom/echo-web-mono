---
title: API Backend
description: echo's backend API bygget med Hono for web applikasjoner og tjenester.
---

API backend er en moderne Node.js applikasjon bygget med Hono.js som tilbyr REST endpoints for echo's webapplikasjoner. Den håndterer business logic, database operasjoner, og integrasjoner med eksterne tjenester.

## Teknologi

### Core Stack

- **Hono.js** - Moderne web framework for Node.js
- **TypeScript** - Type safety og developer experience
- **Drizzle ORM** - Type-safe database queries
- **Zod** - Runtime validation og schema parsing
- **esbuild** - Rask bundling og building

### Database og data

- **PostgreSQL** - Hoveddatabase
- **Drizzle ORM** - Database toolkit
- **PGlite** - Embedded PostgreSQL for testing
- **Date-fns** - Dato/tid utilities

## Struktur

```
apps/api/
├── src/
│   ├── app.ts              # Hono app konfigurasjon
│   ├── index.ts            # Server entry point
│   ├── lib/                # Shared utilities
│   │   ├── db.ts          # Database connection
│   │   ├── hono.ts        # Hono helpers
│   │   └── logger.ts      # Logging setup
│   ├── middleware/         # Custom middleware
│   │   └── admin.ts       # Admin authentication
│   ├── services/           # API endpoints
│   │   ├── admin.ts       # Admin operations
│   │   ├── happening.ts   # Arrangementsstyring
│   │   ├── feedback.ts    # Tilbakemeldinger
│   │   ├── birthdays.ts   # Bursdagsdata
│   │   ├── degrees.ts     # Studieretninger
│   │   ├── shopping-list.ts # Hyggkom handleliste
│   │   └── strikes.ts     # Prikksystem
│   └── utils/             # Helper functions
├── test/                  # Unit og integration tests
└── Dockerfile            # Container konfigurasjon
```

## API Services

### Health Check (`/`)

```typescript
// GET / - API status
{
  status: "ok",
  timestamp: "2024-01-01T12:00:00Z"
}
```

### Admin (`/admin`)

- **GET /admin/users** - Hent alle brukere
- **POST /admin/users** - Opprett ny bruker
- **PUT /admin/users/:id** - Oppdater bruker
- **DELETE /admin/users/:id** - Slett bruker

### Arrangementer (`/happenings`)

- **GET /happenings** - Hent arrangementer
- **GET /happenings/:id** - Hent spesifikt arrangement
- **POST /happenings** - Opprett arrangement
- **PUT /happenings/:id** - Oppdater arrangement

### Tilbakemeldinger (`/feedback`)

- **POST /feedback** - Send tilbakemelding
- **GET /feedback** - Hent tilbakemeldinger (admin)
- **PUT /feedback/:id** - Marker som lest

### Handleliste (`/shopping-list`)

- **GET /shopping-list** - Hent handleliste
- **POST /shopping-list/items** - Legg til vare
- **DELETE /shopping-list/items/:id** - Fjern vare

### Bursdager (`/birthdays`)

- **GET /birthdays** - Hent dagens bursdager
- **GET /birthdays/upcoming** - Kommende bursdager

### Studieretninger (`/degrees`)

- **GET /degrees** - Hent alle studieretninger
- **POST /degrees** - Opprett ny studieretning

### Prikker (`/strikes`)

- **GET /strikes** - Hent brukerens prikker
- **POST /strikes** - Gi prikk (admin)
- **DELETE /strikes/:id** - Fjern prikk (admin)

## Database integrasjon

### Migrations

```bash
# Generer ny migration
pnpm db:generate

# Kjør migrations
pnpm db:migrate
```

## Error Handling

### Validation med Zod

```typescript
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  year: z.number().min(1).max(5),
});

// I endpoint
const result = createUserSchema.safeParse(await c.req.json());
if (!result.success) {
  return c.json({ error: "Invalid data", details: result.error }, 400);
}
```

## Testing

### Unit tests

```bash
# Kjør tester
pnpm test:unit

# Med watch mode
pnpm test:unit --watch
```

### Test struktur

```typescript
// test/services/admin.test.ts
import { describe, expect, it } from "vitest";

import app from "../../src/app";

describe("Admin API", () => {
  it("should require authentication", async () => {
    const res = await app.request("/admin/users");
    expect(res.status).toBe(401);
  });
});
```

## Monitoring og logging

### Structured logging

```typescript
import { logger } from "./lib/logger";

// Log levels: debug, info, warn, error
logger.info("User created", { userId, email });
logger.error("Database error", { error: error.message });
```

## Vanlige oppgaver

### Legge til ny endpoint

```typescript
// services/ny-service.ts
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono();

app.get("/ny-endpoint", async (c) => {
  // Implementasjon her
  return c.json({ message: "Success" });
});

export default app;
```

### Database operasjoner

```typescript
// Med error handling
try {
  const result = await db.insert(users).values(userData);
  return c.json(result, 201);
} catch (error) {
  logger.error("Database error", { error });
  return c.json({ error: "Failed to create user" }, 500);
}
```

## Kilder

### Hono.js

- [Hono dokumentasjon](https://hono.dev/)
- [Hono middleware](https://hono.dev/middleware/builtin/cors)
- [Hono routing](https://hono.dev/api/routing)

### Database

- [Drizzle ORM](https://orm.drizzle.team/)
- [PostgreSQL dokumentasjon](https://www.postgresql.org/docs/)

### Validation og utils

- [Zod dokumentasjon](https://zod.dev/)
- [date-fns](https://date-fns.org/)

### Deployment

- [Fly.io dokumentasjon](https://fly.io/docs/)
- [Docker Node.js guide](https://nodejs.org/en/docs/guides/nodejs-docker-webapp)

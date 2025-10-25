---
title: Database
description: Oversikt over database-oppsett med PostgreSQL og Drizzle ORM.
---

echo-web-mono bruker **PostgreSQL** som database og **Drizzle ORM** for type-safe database-operasjoner. All database-relatert kode ligger i `packages/db`.

## Teknologier

- **PostgreSQL** - Relasjonell database
- **Drizzle ORM** - Type-safe ORM for TypeScript
- **Drizzle Kit** - CLI for migrasjoner og Drizzle Studio
- **Docker** - Lokal database i container

## Viktige kommandoer

```bash
# Start database (Docker)
pnpm db:up

# Stopp database
pnpm db:down

# Full database reset (sletter alt!)
pnpm db:setup

# Generer nye migrasjoner fra schema-endringer
pnpm db:generate

# Kjør migrasjoner
pnpm db:migrate

# Valider database schema
pnpm db:check

# Åpne Drizzle Studio (database GUI)
pnpm db:dev
```

## Database-struktur

Alle schemas ligger i `packages/db/src/schemas/`:

- **users** - Brukere og profiler
- **sessions** - Autentisering og sesjoner
- **happenings** - Arrangementer
- **registrations** - Påmeldinger til arrangementer
- **groups** - Grupper og undergrupper
- **users-to-groups** - Medlemskap i grupper
- **comments** - Kommentarer på arrangementer
- **reactions** - Reaksjoner og emoji-responser
- **questions** og **answers** - Spørsmål i påmeldingsskjema
- **site-feedback** - Tilbakemeldinger fra brukere
- Og flere...

## Bruke database-pakken

Database-pakken eksporteres med flere paths for ulike bruksområder:

### I Next.js (serverless)

```typescript
// Server Components og API Routes
import { db } from "@echo-webkom/db/serverless";

// Hent brukere med relational query API
const users = await db.query.users.findMany({
  with: {
    memberships: true,
  },
});
```

### I API/backend (Node.js)

```typescript
// Standard import for Node.js miljøer
import { db } from "@echo-webkom/db";

const user = await db.query.users.findFirst({
  where: eq(users.id, userId),
});
```

### Schemas direkte

```typescript
// Importer schemas for queries
import { happenings, users } from "@echo-webkom/db/schemas";
import { and, eq, gte } from "drizzle-orm";

// Bruk med db
const upcomingHappenings = await db
  .select()
  .from(happenings)
  .where(gte(happenings.date, new Date()));
```

## Migrasjoner

Når du endrer schemas, må du generere og kjøre migrasjoner:

```bash
# 1. Endre schema i packages/db/src/schemas/
# 2. Generer migrasjon
pnpm db:generate

# 3. Sjekk at migrasjonen er korrekt
pnpm db:check

# 4. Kjør migrasjonen
pnpm db:migrate
```

Migrasjonsfiler lagres i `packages/db/drizzle/` og bør committes til git.

## Drizzle Studio

Drizzle Studio er et visuelt verktøy for å utforske og redigere databasen:

```bash
pnpm db:dev
```

Åpnes automatisk på [local.drizzle.studio](https://local.drizzle.studio) (backend kjører på port 4983).

## Miljøvariabler

Database-tilkobling konfigureres i `.env`:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/echo-web"
```

## Testdata

For lokal utvikling kan du bruke seeder-pakken:

```bash
# Seed med testdata
pnpm seed

# Seed med spesifikk modus
pnpm seed database --mode dev    # Utviklingsdata
pnpm seed database --mode test   # Testdata for E2E
pnpm seed database --mode prod   # Produksjonslignende data
```

## Relational Queries

Drizzle har kraftig støtte for relasjonelle queries:

```typescript
// Hent happening med påmeldinger og kommentarer
const happening = await db.query.happenings.findFirst({
  where: eq(happenings.slug, "bedpres-bekk"),
  with: {
    registrations: {
      with: {
        user: true, // Include brukerinfo
      },
    },
    comments: {
      with: {
        author: true,
        reactions: true,
      },
    },
  },
});
```

## Tips

- **Type-sikkerhet** - Drizzle gir fullstendig TypeScript type inference
- **Studio** - Bruk Drizzle Studio for rask debugging og data-inspeksjon
- **Migrations** - Alltid commit migrasjonsfiler til git
- **Serverless** - Bruk `@echo-webkom/db/serverless` i Next.js for connection pooling

## Videre lesning

- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Drizzle Kit Documentation](https://orm.drizzle.team/kit-docs/overview)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

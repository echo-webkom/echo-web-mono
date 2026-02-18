---
title: echo-web-mono Oversikt
description: Oversikt over echo's hovedmonorepo med alle webapplikasjoner og tjenester.
---

echo-web-mono er hovedmonorepoet som inneholder alle echo's webapplikasjoner og tjenester. Dette er en moderne fullstack-løsning bygget med TypeScript og moderne webutviklingsteknologier.

## Arkitektur

Monorepoet er organisert med Turbo og pnpm workspaces for optimal utvikleropplevelse og delt kode.

### Applikasjoner (`/apps`)

| App      | Beskrivelse                       | Teknologi            | Port |
| -------- | --------------------------------- | -------------------- | ---- |
| **web**  | Hovednettsiden til echo           | Next.js 16, React 19 | 3000 |
| **cms**  | Sanity Studio for innholdsstyring | Sanity.io            | 3333 |
| **uno**  | Backend API for webapplikasjoner  | Go, Chi              | 8000 |
| **docs** | Denne dokumentasjonssiden         | Astro, Starlight     | 4321 |

### Delte pakker (`/packages`)

- **db** - Database schemas og migrasjoner (Drizzle ORM + PostgreSQL)
- **sanity** - Delte Sanity queries og utilities
- **lib** - Felles utilities og business logic
- **email** - E-post templates og sending
- **seeder** - Database seeding utilities

## Teknologi-stack

### Frontend

- **Next.js 16** med App Router
- **React 19** med server components
- **Tailwind CSS** for styling
- **TypeScript** med strict type checking

### Backend

- **Uno** (Go + Chi) for hovedbackend
- **PostgreSQL** database
- **sqlx** for databaseoperasjoner i Uno
- **Drizzle ORM** i TypeScript-delene av monorepoet

### CMS og innhold

- **Sanity.io** headless CMS
- **Sanity Studio** for innholdsredigering

### DevOps og deployment

- **Docker** for containerisering
- **Vercel** for frontend deployment
- **Fly.io** for backend deployment
- **Turbo** for monorepo management
- **pnpm** for package management

## Utviklingskommandoer

### Kjøre alle tjenester

```bash
# Start alle applikasjoner
pnpm dev
```

### Spesifikke applikasjoner

```bash
pnpm web:dev     # Kun web (localhost:3000)
pnpm cms:dev     # Kun CMS (localhost:3333)
pnpm db:dev      # Drizzle Studio (localhost:4983)
```

### Database operasjoner

```bash
pnpm db:setup    # Full database reset
pnpm db:migrate  # Kjør migrasjoner
pnpm db:generate # Generer nye migrasjoner
pnpm seed        # Seed database med testdata
pnpm seed database --mode <prod | dev | test>
```

### Testing og kvalitet

```bash
pnpm test:unit   # Unit tests
pnpm test:e2e    # End-to-end tests
pnpm lint        # ESLint alle pakker
pnpm typecheck   # TypeScript type checking
pnpm format      # Prettier formatering
```

Se [Testing](/tjenester/echo-web-mono/testing) for detaljert guide om unit testing og E2E-testing.

## Environment setup

### Krever

- Node.js 22+ (anbefalt: bruk fnm/nvm)
- pnpm 9+
- Docker (for database)
- cenv (echo's miljø-verktøy)

### Første gangs oppsett

```bash
# 1. Clone repository
git clone git@github.com:echo-webkom/echo-web-mono.git
cd echo-web-mono

# 2. Kopier environment variabler
cp .env.example .env

# 3. Valider environment
cenv check

# 4. Installer dependencies
pnpm install

# 5. Sett opp database
pnpm db:setup

# 6. Seed med testdata
pnpm seed

# 7. Start utvikling
pnpm dev
```

## Databaser og miljøer

### Lokalt miljø

- **PostgreSQL** kjører i Docker container
- **Drizzle Studio** for database management
- **Test data** via seeder package

### Produksjon

- **Produksjon**: Vercel + Sanity produksjon dataset
- **Staging**: Preview deployments med develop dataset
- **Testing**: Test miljø for automatiserte tester

## Arbeidsflyt

### Development

1. Opprett feature branch: `git switch -c fornavn/feature-beskrivelse`
2. Start utviklingsmiljø: `pnpm dev`
3. Gjør endringer i relevante apps/packages
4. Test endringer: `pnpm lint && pnpm typecheck`
5. Commit og push: `git push origin branch-navn`
6. Opprett Pull Request på GitHub

### Deployment

Alt blir deployed automatisk ved push til `main`.

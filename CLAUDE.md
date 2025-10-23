# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Environment Setup

Before starting development:

1. Install required tools: [pnpm](https://pnpm.io/installation), [docker](https://docs.docker.com/engine/install/), and [cenv](https://github.com/echo-webkom/cenv)
2. Copy `.env.example` to `.env` and configure environment variables
3. Run `cenv check` to validate environment setup
4. Install dependencies: `pnpm install`
5. Setup database: `pnpm db:setup`
6. Seed database: `pnpm seed`

## Common Development Commands

### Development

- `pnpm dev` - Start development servers for web, API, and CMS
- `pnpm web:dev` - Start only the web application
- `pnpm cms:dev` - Start only Sanity Studio CMS
- `pnpm db:dev` - Start Drizzle Studio for database management
- `pnpm email:preview` - Preview email templates

### Building and Testing

- `pnpm build` - Build all applications
- `pnpm test:unit` - Run unit tests across all packages
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm test:e2e:ui` - Run E2E tests with UI
- `pnpm --filter=web test:unit` - Run unit tests for web app only (note: timezone is set to UTC-1)

### Code Quality

- `pnpm lint` - Run ESLint on all packages
- `pnpm lint:fix` - Fix auto-fixable linting issues
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

### Database Operations

- `pnpm db:generate` - Generate database schema changes (creates migration files)
- `pnpm db:migrate` - Run database migrations
- `pnpm db:check` - Validate database schema
- `pnpm db:up` - Start Docker database
- `pnpm db:down` - Stop Docker database
- `pnpm db:setup` - Complete database reset and setup (removes data, starts fresh)

### Other Commands

- `pnpm extract` - Extract Sanity schema
- `pnpm typegen` - Generate Sanity types
- `pnpm clean` - Clean root node_modules and .turbo
- `pnpm clean-workspaces` - Clean all workspace node_modules

## Architecture Overview

This is a full-stack monorepo for echo – Linjeforeningen for informatikk (student organization for informatics at University of Bergen).

### Applications (`/apps`)

- **web** - Next.js 15 main website with React 19, Tailwind CSS, and custom session-based auth
  - Uses App Router with route groups: `(default)`, `(redirects)`, `(wrapped)`
  - Server Actions organized in `_actions` directories co-located with routes
  - Authentication handled via custom session management (`src/auth/session.ts`) with JWT cookies and Feide integration
- **api** - Hono.js backend API built with Node.js and esbuild
  - Lightweight REST API for specific endpoints
  - Uses shared database schemas from `@echo-webkom/db`
- **cms** - Sanity Studio for content management

### Shared Packages (`/packages`)

- **db** - Database schemas, migrations, and utilities using Drizzle ORM with PostgreSQL
  - Schemas organized in `/src/schemas/` (users, sessions, happenings, registrations, etc.)
  - Multiple export paths: `@echo-webkom/db` (default), `@echo-webkom/db/schemas`, `@echo-webkom/db/serverless`, `@echo-webkom/db/create`
  - Use `@echo-webkom/db/serverless` in Next.js server components and API routes
- **sanity** - Shared Sanity queries and utilities
- **lib** - Common utilities and business logic
- **email** - Email templates and sending functionality
- **seeder** - Database seeding utilities

### Testing (`/playwright`)

- End-to-end tests using Playwright for both API and web applications
- E2E tests depend on building applications first (see turbo.json)

## Key Technologies

- **Monorepo**: Managed with Turbo, pnpm workspaces
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Backend**: Hono.js (Node.js)
- **Database**: PostgreSQL with Drizzle ORM
- **CMS**: Sanity.io
- **Auth**: Custom session-based authentication with Feide (Norwegian academic federation) OAuth integration

## Development Ports

- Web application: http://localhost:3000
- Sanity Studio: http://localhost:3333
- API server: http://localhost:8000
- Drizzle Studio: https://local.drizzle.studio (backend on port 4983)

## Data Flow & Patterns

### Authentication Flow

- Sessions stored in database with JWT cookies for client-side session identification
- `auth()` function from `apps/web/src/auth/session.ts` retrieves current user with memberships
- Session management uses React's `cache()` for request-level memoization
- Feide OAuth handled via Arctic library in `apps/web/src/auth/feide.ts`

### Database Access

- Web app and API share database schemas from `@echo-webkom/db`
- Use Drizzle's relational query API: `db.query.<table>.findFirst/findMany`
- Import from `@echo-webkom/db/serverless` in serverless environments (Next.js, Vercel)
- Import from `@echo-webkom/db` for standard Node.js environments

### Content Management

- Static content managed via Sanity CMS
- Dynamic data (users, registrations, etc.) stored in PostgreSQL
- Sanity queries shared in `packages/sanity`

## Important Notes

- Always run lint and typecheck commands before committing changes
- The project uses pnpm for package management - never use npm or yarn
- Environment variables are managed through `.env` file - use `cenv` to validate
- Database changes require running migrations with `pnpm db:generate` and `pnpm db:migrate`
- The codebase uses TypeScript throughout with strict type checking enabled
- All applications share database schemas and utilities from the `packages/db` workspace
- Turbo manages monorepo builds and caching - see `turbo.json` for task dependencies

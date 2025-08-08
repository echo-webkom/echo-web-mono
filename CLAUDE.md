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
- `pnpm dev:beta` - Start beta version development servers
- `pnpm web:dev` - Start only the web application
- `pnpm cms:dev` - Start only Sanity Studio CMS
- `pnpm db:dev` - Start Drizzle Studio for database management

### Building and Testing

- `pnpm build` - Build all applications
- `pnpm test:unit` - Run unit tests across all packages
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm test:e2e:ui` - Run E2E tests with UI

### Code Quality

- `pnpm lint` - Run ESLint on all packages
- `pnpm lint:fix` - Fix auto-fixable linting issues
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

### Database Operations

- `pnpm db:generate` - Generate database schema changes
- `pnpm db:migrate` - Run database migrations
- `pnpm db:check` - Validate database schema
- `pnpm db:up` - Start Docker database
- `pnpm db:down` - Stop Docker database
- `pnpm db:setup` - Complete database reset and setup

## Architecture Overview

This is a full-stack monorepo for echo – Linjeforeningen for informatikk (student organization for informatics at University of Bergen).

### Applications (`/apps`)

- **web** - Next.js 15 main website with React 19, Tailwind CSS, NextAuth.js
- **api** - Hono.js backend API built with Node.js and esbuild
- **cms** - Sanity Studio for content management
- **uno** - Go backend for beta application

### Shared Packages (`/packages`)

- **db** - Database schemas, migrations, and utilities using Drizzle ORM with PostgreSQL
- **sanity** - Shared Sanity queries and utilities
- **lib** - Common utilities and business logic
- **email** - Email templates and sending functionality
- **seeder** - Database seeding utilities
- **config/eslint** - Shared ESLint configurations
- **uno-client** - Client library for Uno integration

### Testing (`/playwright`)

- End-to-end tests using Playwright for both API and web applications

## Key Technologies

- **Monorepo**: Managed with Turbo, pnpm workspaces
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Backend**: Hono.js (Node.js), Go for beta API
- **Database**: PostgreSQL with Drizzle ORM
- **CMS**: Sanity.io
- **Auth**: NextAuth.js with Feide (Norwegian academic federation)
- **Deployment**: Docker containers, hosted on Vercel

## Development Ports

- Web application: http://localhost:3000
- Sanity Studio: http://localhost:3333
- API server: http://localhost:8000
- Drizzle Studio: https://local.drizzle.studio (backend on port 4983)
- Uno API: http://localhost:8002

## Important Notes

- Always run lint and typecheck commands before committing changes
- The project uses pnpm for package management - never use npm or yarn
- Environment variables are managed through `.env` file - use `cenv` to validate
- Database changes require running migrations with `pnpm db:generate` and `pnpm db:migrate`
- The codebase uses TypeScript throughout with strict type checking enabled
- All applications share database schemas and utilities from the `packages/db` workspace

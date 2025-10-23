# check=skip=SecretsUsedInArgOrEnv
# Skip because this is a test environment, no secrets are used here.

FROM mcr.microsoft.com/playwright:v1.56.1-noble AS base

RUN corepack enable && corepack prepare pnpm@10.18.3 --activate

RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY apps/cms/package.json ./apps/cms/
COPY packages/db/package.json ./packages/db/
COPY packages/sanity/package.json ./packages/sanity/
COPY packages/lib/package.json ./packages/lib/
COPY packages/email/package.json ./packages/email/
COPY packages/seeder/package.json ./packages/seeder/
COPY playwright/package.json ./playwright/

FROM base AS deps
RUN pnpm install --frozen-lockfile

FROM deps AS builder

COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

ENV NEXT_PUBLIC_API_URL=http://localhost:8000
ENV NEXT_PUBLIC_SANITY_DATASET=testing
ENV PUBLIC_SANITY_DATASET=testing
ENV PUBLIC_SANITY_PROJECT_ID=pgq2pd26
ENV PUBLIC_UNO_URL=http://localhost:8002
ENV PUBLIC_ECHOGRAM_URL=http://localhost:8001
ENV PUBLIC_COMMIT_HASH=test

RUN pnpm --filter=api build
RUN pnpm --filter=web build

FROM builder AS test

# Set entrypoint to handle database migration, seeding, and running tests
COPY playwright/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

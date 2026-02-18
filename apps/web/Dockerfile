FROM node:24.13.0-alpine AS base

RUN apk update && apk add --no-cache libc6-compat
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm add -g turbo@2.5.8

FROM base AS builder

WORKDIR /app
COPY . .
RUN turbo prune @echo-webkom/web --docker

FROM base AS installer
WORKDIR /app

ARG GIT_COMMIT_SHA
ENV NEXT_PUBLIC_GIT_COMMIT_SHA=${GIT_COMMIT_SHA}

# Copy lockfile and package.json files
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install dependencies with cache mount
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Copy source code
COPY --from=builder /app/out/full/ .

# Build with cache mount (only web, skip dependencies)
ENV NEXT_OUTPUT=standalone
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm turbo build --filter=@echo-webkom/web --only

FROM node:24.13.0-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

CMD ["node", "apps/web/server.js"]
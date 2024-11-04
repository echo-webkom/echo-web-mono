FROM node:20.18.0-alpine AS base

RUN npm install -g turbo@2.0.14
RUN npm install -g pnpm@9.7.1

FROM base AS builder

RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY . .
RUN turbo prune @echo-webkom/web --docker

FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=builder /app/out/json/ .
RUN pnpm install

COPY --from=builder /app/out/full/ .

RUN pnpm turbo build --filter=@echo-webkom/web...

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

CMD node apps/web/server.js

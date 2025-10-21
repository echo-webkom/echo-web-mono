FROM node:22.20.0-alpine AS base

RUN npm install -g turbo@2.5.6
RUN npm install -g pnpm@9.7.1

FROM base AS builder

RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY . .
RUN turbo prune @echo-webkom/api --docker

FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=builder /app/out/json/ .
RUN pnpm install

COPY --from=builder /app/out/full/ .

RUN pnpm turbo build --filter=@echo-webkom/api...

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono
USER hono

COPY --from=installer /app/apps/api/dist ./dist

CMD node ./dist/index.js

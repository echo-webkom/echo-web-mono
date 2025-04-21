# syntax=docker/dockerfile:1.4


FROM node:22-alpine AS base

ARG PUBLIC_VERTEX_FEIDE_REDIRECT_URI
ENV PUBLIC_VERTEX_FEIDE_REDIRECT_URI=$PUBLIC_VERTEX_FEIDE_REDIRECT_URI
ARG PUBLIC_SANITY_DATASET
ENV PUBLIC_SANITY_DATASET=$PUBLIC_SANITY_DATASET
ARG PUBLIC_SANITY_PROJECT_ID
ENV PUBLIC_SANITY_PROJECT_ID=$PUBLIC_SANITY_PROJECT_ID
ARG PUBLIC_AXIS_URL
ENV PUBLIC_AXIS_URL=$PUBLIC_AXIS_URL
ARG PUBLIC_ECHOGRAM_URL
ENV PUBLIC_ECHOGRAM_URL=$PUBLIC_ECHOGRAM_URL
ARG PUBLIC_COMMIT_HASH
ENV PUBLIC_COMMIT_HASH=$PUBLIC_COMMIT_HASH

RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@$PNPM_VERSION --activate \
    && npm install -g turbo@$TURBO_VERSION

FROM base as builder

WORKDIR /app
COPY . .
RUN turbo prune @echo-webkom/vertex --docker

FROM base AS installer

WORKDIR /app

COPY --from=builder /app/out/json/ .
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .
RUN --mount=type=secret,id=database_url \
    --mount=type=secret,id=admin_key \
    export DATABASE_URL="$(cat /run/secrets/database_url)" && \
    export ADMIN_KEY="$(cat /run/secrets/admin_key)" && \
    pnpm --filter=vertex run build

FROM base AS runner

WORKDIR /app

COPY --from=installer /app/package.json ./
COPY --from=installer /app/apps/vertex/package.json ./apps/vertex/package.json
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/vertex/node_modules ./apps/vertex/node_modules
COPY --from=installer /app/apps/vertex/build ./apps/vertex/build

EXPOSE 3000
CMD ["node", "./apps/vertex/build/index.js"]

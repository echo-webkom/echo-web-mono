FROM node:20-alpine AS base

FROM base AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY apps/email/package.json ./
RUN npm install

COPY apps/email/ ./

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nodeuser
USER nodeuser

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/index.js"]

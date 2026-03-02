FROM golang:1.25.3-alpine AS base

RUN apk add --no-cache git ca-certificates

FROM base AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY apps/uno/go.mod apps/uno/go.sum ./
RUN go mod download

COPY apps/uno/ ./

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o /out/uno-web ./cmd/web/main.go
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o /out/uno-cron ./cmd/cron/main.go

FROM alpine:latest AS runner-base

RUN apk --no-cache add ca-certificates

WORKDIR /app

RUN addgroup -S -g 1001 golang
RUN adduser -S -u 1001 -G golang gouser
USER gouser

FROM runner-base AS web
COPY --from=builder /out/uno-web /app/main
CMD ["./main"]

FROM runner-base AS cron
COPY --from=builder /out/uno-cron /app/main
CMD ["./main"]

FROM golang:1.25.3-alpine AS base

RUN apk add --no-cache git ca-certificates

FROM base AS builder

RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY cenv.schema.json ./
COPY apps/uno/go.mod apps/uno/go.sum ./
RUN go mod download

COPY apps/uno/ ./

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/main.go

FROM alpine:latest AS runner

RUN apk --no-cache add ca-certificates

WORKDIR /app

RUN addgroup -S -g 1001 golang
RUN adduser -S -u 1001 -G golang gouser
USER gouser

COPY --from=builder /app/main .

CMD ["./main"]

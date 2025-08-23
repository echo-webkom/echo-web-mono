# syntax=docker/dockerfile:1.17

FROM golang:1.25-alpine AS builder

WORKDIR /app
COPY . .
RUN cd apps/uno && \
    go build -o ./build/uno ./cmd/main.go

FROM golang:1.25-alpine AS runner

WORKDIR /app

COPY --from=builder /app/apps/uno/build/uno /app/apps/uno/build/uno

EXPOSE 8000
CMD ["./apps/uno/build/uno"]

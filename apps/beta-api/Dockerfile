# syntax=docker/dockerfile:1.4

FROM golang:1.24-alpine AS builder

WORKDIR /app
COPY . .
RUN cd apps/axis && \
    go build -o ./build/axis ./cmd/main.go

FROM golang:1.24-alpine AS runner

WORKDIR /app

COPY --from=builder /app/apps/axis/build/axis /app/apps/axis/build/axis

EXPOSE 8000
CMD ["./apps/axis/build/axis"]

FROM golang:1.24.2 AS build
WORKDIR /app
COPY . .
RUN go build -o main ./cmd/main.go

FROM debian:bullseye-slim
WORKDIR /app
COPY --from=build /app/main .
EXPOSE 8080
CMD ["./main"]

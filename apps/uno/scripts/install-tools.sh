#!/bin/bash
set -e

echo "📦 Installing Go development tools..."
echo ""

echo "Installing air (hot reload)..."
go install github.com/air-verse/air@latest

echo "Installing goose (database migrations)..."
go install github.com/pressly/goose/v3/cmd/goose@latest

echo "Installing swag (API docs)..."
go install github.com/swaggo/swag/cmd/swag@latest

echo "Installing mockery (test mocks)..."
go install github.com/vektra/mockery/v3@latest

echo ""
echo "✅ All tools installed successfully!"
echo ""
echo "Available commands:"
echo "  air              - Hot reload server"
echo "  swag             - Generate Swagger docs"
echo "  mockery          - Generate test mocks"

if ! command -v golangci-lint &>/dev/null; then
    echo ""
    echo "Install golangci-lint with:"
    echo "  curl -sSfL https://golangci-lint.run/install.sh | sh -s -- -b \$(go env GOPATH)/bin v2.11.4"
fi

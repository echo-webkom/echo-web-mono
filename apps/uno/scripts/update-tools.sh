#!/bin/bash
set -e

echo "🔄 Updating Go development tool dependencies..."
echo ""

go get -u github.com/air-verse/air@latest \
       github.com/swaggo/swag/cmd/swag@latest \
       github.com/vektra/mockery/v3@latest

echo ""
echo "Tidying go.mod..."
go mod tidy

echo ""
echo "✅ Tool dependencies updated in go.mod!"
echo ""
echo "Run 'pnpm tools:install' to install the updated versions."

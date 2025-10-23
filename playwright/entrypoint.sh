#!/bin/bash
set -e

echo "🔍 Pinging database..."
# Wait for database to be ready
until PGPASSWORD=postgres psql -h db-test -U postgres -d echo-web-test -c '\q' 2>/dev/null; do
  echo "⏳ Waiting for database..."
  sleep 2
done

echo "✅ Database is ready!"

cd /app

echo "🧹 Resetting database..."
pnpm db:reset

echo "🏗️  Running database migrations..."
pnpm db:migrate

echo "🌱 Seeding database..."
pnpm seed database --mode test

echo "🎭 Running E2E tests..."
cd /app/playwright
pnpm test:e2e

echo "✅ E2E tests completed!"

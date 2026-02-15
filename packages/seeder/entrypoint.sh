#!/bin/sh
set -e

cd /app/packages/db
echo "Running migrations..."
until pnpm tsx ./drizzle/migrate.ts; do
  echo "Migration failed, retrying in 5s..."
  sleep 5
done

cd /app/packages/seeder
echo "Seeding database..."
pnpm tsx ./src/index.ts all --mode test --dataset "$NEXT_PUBLIC_SANITY_DATASET"

echo "Migrations and seeding complete!"

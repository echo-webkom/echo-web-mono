---
name: add-drizzle-migration
description: Use when the user asks to add, modify, or remove a database column, table, relation, or enum in this project. Trigger phrases include "add column", "new table", "change schema", "add migration", "update schema", "drizzle migration".
---

# Add Drizzle Migration

Schema lives in `packages/db/src/schemas/`. Each table has its own file. Migrations are generated automatically by Drizzle Kit — never write migration SQL by hand.

## Steps

1. **Edit the schema** in `packages/db/src/schemas/<table>.ts`. Follow the existing patterns:

```ts
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const things = pgTable("thing", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

Use snake_case for column names to match the existing convention. The table name should be in singular form (e.g. `thing` not `things`) to match the existing pattern.

2. **Export the schema** from `packages/db/src/schemas/index.ts` if adding a new table.

3. **Generate the migration**:

```bash
pnpm --filter=db db:generate
```

This runs `drizzle-kit generate` and creates a new SQL file in `packages/db/drizzle/migrations/`.

4. **Check the generated migration** looks correct before committing.

5. **Apply locally** (optional, for testing):

```bash
pnpm --filter=db db:migrate
```

## Important rules

- **Never hand-edit migration files** — always regenerate via `db:generate`.
- **Never delete migration files** — Drizzle tracks applied migrations by filename.
- The schema source of truth is `packages/db/src/schemas/` — not the migration SQL.
- New tables should call `.enableRLS()` to match the existing pattern.
- After schema changes that affect `apps/uno`, update the corresponding record type in `apps/uno/infrastructure/postgres/record/` and the SQL queries that reference the changed columns.

CREATE UNIQUE INDEX IF NOT EXISTS "unique_email_idx" ON "user" ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_alternative_email_idx" ON "user" ("alternative_email");
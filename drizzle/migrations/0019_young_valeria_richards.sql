DROP INDEX IF EXISTS "post_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "slug_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "user_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_idx" ON "comment" USING btree (post_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "slug_idx" ON "happening" USING btree (slug);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_idx" ON "strike" USING btree (user_id,id);
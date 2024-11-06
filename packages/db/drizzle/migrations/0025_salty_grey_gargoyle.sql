ALTER TABLE "invitation" ADD COLUMN "expires_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "invitation" DROP COLUMN IF EXISTS "timeout";
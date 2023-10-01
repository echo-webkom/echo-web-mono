DO $$ BEGIN
 CREATE TYPE "site_feedback_type" AS ENUM('bug', 'feature', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "site_feedback" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "site_feedback" ADD COLUMN "type" "site_feedback_type" NOT NULL;
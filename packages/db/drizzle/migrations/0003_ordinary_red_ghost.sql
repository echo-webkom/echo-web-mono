DO $$ BEGIN
 CREATE TYPE "feedback_category" AS ENUM('bug', 'feature', 'login', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "site_feedback" ADD COLUMN "category" "feedback_category" NOT NULL;
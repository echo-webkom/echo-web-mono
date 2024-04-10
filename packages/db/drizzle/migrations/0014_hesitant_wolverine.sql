ALTER TABLE "registration" ADD COLUMN "prev_status" "registration_status";--> statement-breakpoint
ALTER TABLE "registration" ADD COLUMN "changed_at" timestamp (3);--> statement-breakpoint
ALTER TABLE "registration" ADD COLUMN "changed_by" text;--> statement-breakpoint
ALTER TABLE "registration" DROP COLUMN IF EXISTS "registration_changed_at";
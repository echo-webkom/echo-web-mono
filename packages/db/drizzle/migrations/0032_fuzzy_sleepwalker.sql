ALTER TABLE "verification_token" ADD COLUMN "code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "verification_token" ADD COLUMN "used" boolean DEFAULT false NOT NULL;
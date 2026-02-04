ALTER TABLE "verification_token" ADD COLUMN "code" text;--> statement-breakpoint
ALTER TABLE "verification_token" ADD COLUMN "used" boolean DEFAULT false NOT NULL;
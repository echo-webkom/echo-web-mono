DO $$ BEGIN
 CREATE TYPE "public"."inviteResponse" AS ENUM('pending', 'accepted', 'declined', 'timed out');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invitation" (
	"id" text NOT NULL,
	"happening_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp,
	"timeout" timestamp NOT NULL,
	"response" "inviteResponse" DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invitation" ADD CONSTRAINT "invitation_happening_id_happening_id_fk" FOREIGN KEY ("happening_id") REFERENCES "public"."happening"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invitation" ADD CONSTRAINT "invitation_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

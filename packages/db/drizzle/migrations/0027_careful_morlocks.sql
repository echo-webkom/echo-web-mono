CREATE TABLE IF NOT EXISTS "user_to_trophy" (
	"user_id" text NOT NULL,
	"trophy_id" text NOT NULL,
	CONSTRAINT "user_to_trophy_trophy_id_user_id_pk" PRIMARY KEY("trophy_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trophy" (
	"id" text PRIMARY KEY NOT NULL,
	"xp" integer NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"color" text NOT NULL,
	"icon" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "xp" integer DEFAULT 0;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_to_trophy" ADD CONSTRAINT "user_to_trophy_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_to_trophy" ADD CONSTRAINT "user_to_trophy_trophy_id_trophy_id_fk" FOREIGN KEY ("trophy_id") REFERENCES "public"."trophy"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

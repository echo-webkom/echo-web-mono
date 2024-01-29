CREATE TABLE IF NOT EXISTS "reaction" (
	"happening_id" text NOT NULL,
	"emoji_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "reaction_happening_id_emoji_id_user_id_pk" PRIMARY KEY("happening_id","emoji_id","user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reaction" ADD CONSTRAINT "reaction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

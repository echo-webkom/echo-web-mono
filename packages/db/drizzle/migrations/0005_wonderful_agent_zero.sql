CREATE TABLE IF NOT EXISTS "strike" (
	"user_id" text NOT NULL,
	"happening_slug" varchar(255) NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"amount" integer DEFAULT 1 NOT NULL,
	CONSTRAINT strike_user_id_happening_slug PRIMARY KEY("user_id","happening_slug")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "strike" ADD CONSTRAINT "strike_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "strike" ADD CONSTRAINT "strike_happening_slug_happening_slug_fk" FOREIGN KEY ("happening_slug") REFERENCES "happening"("slug") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

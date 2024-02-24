CREATE TABLE IF NOT EXISTS "strike" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"strike_info_id" uuid NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "strike_info" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"happening_id" varchar(255) NOT NULL,
	"issuer_id" text NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_banned" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "banned_from_strike" integer;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_idx" ON "strike" ("user_id","id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "strike" ADD CONSTRAINT "strike_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "strike" ADD CONSTRAINT "strike_strike_info_id_strike_info_id_fk" FOREIGN KEY ("strike_info_id") REFERENCES "strike_info"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "strike_info" ADD CONSTRAINT "strike_info_happening_id_happening_id_fk" FOREIGN KEY ("happening_id") REFERENCES "happening"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "strike_info" ADD CONSTRAINT "strike_info_issuer_id_user_id_fk" FOREIGN KEY ("issuer_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

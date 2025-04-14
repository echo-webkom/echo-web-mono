CREATE TABLE IF NOT EXISTS "ban_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"banned_by" text NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dot" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"count" integer NOT NULL,
	"reason" text NOT NULL,
	"striked_by" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
DROP TABLE "strike";--> statement-breakpoint
DROP TABLE "strike_info";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ban_info" ADD CONSTRAINT "ban_info_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dot" ADD CONSTRAINT "dot_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "ban_info" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_strike_idx" ON "dot" USING btree ("user_id","id");--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "is_banned";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "banned_from_strike";
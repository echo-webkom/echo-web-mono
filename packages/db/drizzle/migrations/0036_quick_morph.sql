CREATE TABLE "notification" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text,
	"link" text,
	"type" text NOT NULL,
	"user_id" text NOT NULL,
	"seen_at" timestamp,
	"archived_at" timestamp,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE INDEX "notification_user_id_idx" ON "notification" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notification_archived_at_idx" ON "notification" USING btree ("archived_at");
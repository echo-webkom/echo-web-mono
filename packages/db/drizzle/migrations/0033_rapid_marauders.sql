CREATE TABLE "quote" (
	"id" text PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"context" text,
	"person" text NOT NULL,
	"submitted_by" text NOT NULL,
	"submitted_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "quote" ENABLE ROW LEVEL SECURITY;
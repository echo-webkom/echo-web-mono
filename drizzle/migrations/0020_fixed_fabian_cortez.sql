CREATE TABLE IF NOT EXISTS "access_request" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "access_request_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cache" (
	"key" text PRIMARY KEY NOT NULL,
	"value" json,
	"ttl" timestamp DEFAULT now() + interval '1 day' NOT NULL
);

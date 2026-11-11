CREATE TABLE "intgroup_request" (
	"id" text PRIMARY KEY NOT NULL,
	"group_name" text NOT NULL,
	"description" text NOT NULL,
	"interested_people" text NOT NULL,
	"purpose" text NOT NULL,
	"needs_from_hovedstyre" text,
	"contact_email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "intgroup_request" ENABLE ROW LEVEL SECURITY;
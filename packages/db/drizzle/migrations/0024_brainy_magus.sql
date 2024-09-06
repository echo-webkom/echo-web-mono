CREATE TABLE IF NOT EXISTS "subject_review" (
	"id" text NOT NULL,
	"subject_review" text NOT NULL,
	"difficulty" integer NOT NULL,
	"usefullness" integer NOT NULL,
	"enjoyment" integer NOT NULL,
	CONSTRAINT "subject_review_id_subject_review_pk" PRIMARY KEY("id","subject_review")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subject" (
	"subject_code" text PRIMARY KEY NOT NULL,
	"subject_name" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subject_review" ADD CONSTRAINT "subject_review_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subject_review" ADD CONSTRAINT "subject_review_subject_review_subject_subject_code_fk" FOREIGN KEY ("subject_review") REFERENCES "public"."subject"("subject_code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

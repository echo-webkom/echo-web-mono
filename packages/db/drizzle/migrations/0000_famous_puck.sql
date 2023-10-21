DO $$ BEGIN
 CREATE TYPE "degree_type" AS ENUM('bachelors', 'masters', 'integrated', 'year');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "happening_type" AS ENUM('bedpres', 'event', 'external');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "question_type" AS ENUM('text', 'textarea', 'radio', 'checkbox');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "registration_status" AS ENUM('registered', 'unregistered', 'removed', 'waiting');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "user_type" AS ENUM('student', 'company', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT account_provider_provider_account_id PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "answer" (
	"question_id" varchar(21) NOT NULL,
	"user_id" text NOT NULL,
	"happening_slug" text NOT NULL,
	"answer" text,
	CONSTRAINT answer_question_id PRIMARY KEY("question_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "degree" (
	"id" varchar(21) NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT degree_id PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "group" (
	"id" varchar(21) NOT NULL,
	"name" varchar(255) NOT NULL,
	"leader" text,
	CONSTRAINT group_id PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "happenings_to_groups" (
	"happening_slug" varchar(255) NOT NULL,
	"group_id" varchar(21) NOT NULL,
	CONSTRAINT happenings_to_groups_happening_slug_group_id PRIMARY KEY("happening_slug","group_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "happening" (
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"type" "happening_type" DEFAULT 'event' NOT NULL,
	"date" timestamp,
	"registration_start" timestamp,
	"registration_end" timestamp,
	CONSTRAINT happening_slug PRIMARY KEY("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "question" (
	"id" varchar(21) NOT NULL,
	"title" text NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"type" "question_type" DEFAULT 'text' NOT NULL,
	"options" json,
	"happening_slug" text NOT NULL,
	CONSTRAINT question_id PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "registration" (
	"user_id" text NOT NULL,
	"happening_slug" text NOT NULL,
	"status" "registration_status" DEFAULT 'waiting' NOT NULL,
	"unregister_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT registration_user_id_happening_slug PRIMARY KEY("user_id","happening_slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"session_token" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "site_feedback" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255),
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "spot_range" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"happening_slug" varchar(255) NOT NULL,
	"spots" integer NOT NULL,
	"min_year" integer NOT NULL,
	"max_year" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_to_groups" (
	"user_id" text NOT NULL,
	"group_id" varchar(21) NOT NULL,
	CONSTRAINT users_to_groups_user_id_group_id PRIMARY KEY("user_id","group_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"email_verified" timestamp,
	"image" text,
	"alternative_email" varchar(255),
	"degree_id" varchar(21),
	"year" integer,
	"type" "user_type" DEFAULT 'student' NOT NULL,
	CONSTRAINT user_id PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_token" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT verification_token_identifier_token PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "type_idx" ON "happening" ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "status_idx" ON "registration" ("status");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answer" ADD CONSTRAINT "answer_happening_slug_user_id_registration_happening_slug_user_id_fk" FOREIGN KEY ("happening_slug","user_id") REFERENCES "registration"("happening_slug","user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "group" ADD CONSTRAINT "group_leader_user_id_fk" FOREIGN KEY ("leader") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "question" ADD CONSTRAINT "question_happening_slug_happening_slug_fk" FOREIGN KEY ("happening_slug") REFERENCES "happening"("slug") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "registration" ADD CONSTRAINT "registration_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "registration" ADD CONSTRAINT "registration_happening_slug_happening_slug_fk" FOREIGN KEY ("happening_slug") REFERENCES "happening"("slug") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "spot_range" ADD CONSTRAINT "spot_range_happening_slug_happening_slug_fk" FOREIGN KEY ("happening_slug") REFERENCES "happening"("slug") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_groups" ADD CONSTRAINT "users_to_groups_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_groups" ADD CONSTRAINT "users_to_groups_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_degree_id_degree_id_fk" FOREIGN KEY ("degree_id") REFERENCES "degree"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

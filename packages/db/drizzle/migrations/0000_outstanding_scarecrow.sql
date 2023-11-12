DO $$ BEGIN
 CREATE TYPE "degree_type" AS ENUM('bachelors', 'masters', 'integrated', 'year');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "feedback_category" AS ENUM('bug', 'feature', 'login', 'other');
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
	"user_id" text NOT NULL,
	"happening_id" varchar NOT NULL,
	"question_id" varchar NOT NULL,
	"answer" text,
	CONSTRAINT answer_user_id_happening_id_question_id PRIMARY KEY("user_id","happening_id","question_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "degree" (
	"id" varchar NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT degree_id PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "group" (
	"id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"leader" text,
	CONSTRAINT group_id PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "happenings_to_groups" (
	"happening_id" varchar NOT NULL,
	"group_id" varchar NOT NULL,
	CONSTRAINT happenings_to_groups_happening_id_group_id PRIMARY KEY("happening_id","group_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "happening" (
	"id" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"title" varchar NOT NULL,
	"type" "happening_type" DEFAULT 'event' NOT NULL,
	"date" timestamp,
	"registration_start" timestamp,
	"registration_end" timestamp,
	CONSTRAINT happening_id PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "question" (
	"id" varchar NOT NULL,
	"title" text NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"type" "question_type" DEFAULT 'text' NOT NULL,
	"options" json,
	"happening_id" text NOT NULL,
	CONSTRAINT question_id PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "registration" (
	"user_id" text NOT NULL,
	"happening_id" text NOT NULL,
	"spot_range_id" varchar,
	"status" "registration_status" DEFAULT 'waiting' NOT NULL,
	"unregister_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT registration_user_id_happening_id PRIMARY KEY("user_id","happening_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"session_token" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "site_feedback" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar,
	"email" varchar,
	"message" text NOT NULL,
	"category" "feedback_category" NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "spot_range" (
	"id" varchar PRIMARY KEY NOT NULL,
	"happening_id" varchar NOT NULL,
	"spots" integer NOT NULL,
	"min_year" integer NOT NULL,
	"max_year" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_to_groups" (
	"user_id" text NOT NULL,
	"group_id" varchar NOT NULL,
	CONSTRAINT users_to_groups_user_id_group_id PRIMARY KEY("user_id","group_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"email_verified" timestamp,
	"image" text,
	"alternative_email" varchar,
	"degree_id" varchar,
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
CREATE TABLE IF NOT EXISTS "whitelist" (
	"email" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"reason" text NOT NULL,
	CONSTRAINT whitelist_email PRIMARY KEY("email")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "question_idx" ON "answer" ("question_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "type_idx" ON "happening" ("type");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "slug_idx" ON "happening" ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "status_idx" ON "registration" ("status");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answer" ADD CONSTRAINT "answer_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answer" ADD CONSTRAINT "answer_happening_id_happening_id_fk" FOREIGN KEY ("happening_id") REFERENCES "happening"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answer" ADD CONSTRAINT "answer_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "question" ADD CONSTRAINT "question_happening_id_happening_id_fk" FOREIGN KEY ("happening_id") REFERENCES "happening"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "registration" ADD CONSTRAINT "registration_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "registration" ADD CONSTRAINT "registration_happening_id_happening_id_fk" FOREIGN KEY ("happening_id") REFERENCES "happening"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "registration" ADD CONSTRAINT "registration_spot_range_id_spot_range_id_fk" FOREIGN KEY ("spot_range_id") REFERENCES "spot_range"("id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "spot_range" ADD CONSTRAINT "spot_range_happening_id_happening_id_fk" FOREIGN KEY ("happening_id") REFERENCES "happening"("id") ON DELETE cascade ON UPDATE no action;
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

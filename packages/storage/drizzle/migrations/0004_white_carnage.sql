DO $$ BEGIN
 CREATE TYPE "user_role" AS ENUM('admin', 'student', 'company', 'guest');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "degree" AS ENUM('dtek', 'dsik', 'dvit', 'binf', 'imo', 'inf', 'prog', 'dsc', 'armninf', 'post', 'misc');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "group" AS ENUM('makerspace', 'board', 'tilde', 'gnist', 'bedkom', 'esc', 'hyggkom', 'webkom', 'progbar', 'squash');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "happening_type" AS ENUM('bedpres', 'event');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "question_type" AS ENUM('text', 'textarea', 'checkbox', 'radio', 'select');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "registration_status" AS ENUM('registered', 'unregistered', 'waiting', 'removed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "site_feedback_type" AS ENUM('bug', 'feature', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "year" AS ENUM('first', 'second', 'third', 'fourth', 'fifth');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "answer" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"registration_id" uuid,
	"question_id" uuid,
	"answer" varchar(255),
	CONSTRAINT answer_id PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "happening" (
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"type" "happening_type" NOT NULL,
	"date" timestamp with time zone,
	"registration_start" timestamp with time zone,
	"registration_end" timestamp with time zone,
	CONSTRAINT happening_slug PRIMARY KEY("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "password" (
	"user_id" uuid,
	"password" varchar(255) NOT NULL,
	CONSTRAINT password_user_id PRIMARY KEY("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "question" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"happening_slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"type" "question_type",
	"required" boolean DEFAULT false NOT NULL,
	"options" json,
	CONSTRAINT question_id PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "registration" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"happening_slug" varchar(255) NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "registration_status" DEFAULT 'unregistered' NOT NULL,
	CONSTRAINT "registration_user_id_happening_slug_unique" UNIQUE("user_id","happening_slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "site_feedback" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"feedback" varchar(5000) NOT NULL,
	"type" "site_feedback_type" NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT site_feedback_id PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "spot_range" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"happening_slug" varchar(255) NOT NULL,
	"min_year" "year" NOT NULL,
	"max_year" "year" NOT NULL,
	"spots" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_group_membership" (
	"id" "group" NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT user_group_membership_user_id_id PRIMARY KEY("user_id","id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"firstName" varchar(255) NOT NULL,
	"lastName" varchar(255) NOT NULL,
	"student_mail" varchar(255),
	"account_type" "user_role" DEFAULT 'guest' NOT NULL,
	"degree" "degree",
	"year" "year",
	CONSTRAINT user_id PRIMARY KEY("id"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);

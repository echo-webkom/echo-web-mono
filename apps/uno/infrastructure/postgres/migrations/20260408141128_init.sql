-- This is the previous migration files, combined into one,
-- as we have changed the way we do migrations.

DO $$ BEGIN
 CREATE TYPE "degree_type" AS ENUM('bachelors', 'masters', 'integrated', 'year');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 CREATE TYPE "feedback_category" AS ENUM('bug', 'feature', 'login', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 CREATE TYPE "happening_type" AS ENUM('bedpres', 'event', 'external');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 CREATE TYPE "question_type" AS ENUM('text', 'textarea', 'radio', 'checkbox');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 CREATE TYPE "registration_status" AS ENUM('registered', 'unregistered', 'removed', 'waiting');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 CREATE TYPE "user_type" AS ENUM('student', 'company', 'guest', 'alum');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
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
	CONSTRAINT account_provider_provider_account_id_pk PRIMARY KEY("provider","provider_account_id")
);
CREATE TABLE IF NOT EXISTS "answer" (
	"user_id" text NOT NULL,
	"happening_id" varchar NOT NULL,
	"question_id" varchar NOT NULL,
	"answer" json,
	CONSTRAINT answer_user_id_happening_id_question_id_pk PRIMARY KEY("user_id","happening_id","question_id")
);
CREATE TABLE IF NOT EXISTS "degree" (
	"id" varchar NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT degree_id_pk PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "group" (
	"id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"leader" text,
	CONSTRAINT group_id_pk PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "happenings_to_groups" (
	"happening_id" varchar NOT NULL,
	"group_id" varchar NOT NULL,
	CONSTRAINT happenings_to_groups_happening_id_group_id_pk PRIMARY KEY("happening_id","group_id")
);
CREATE TABLE IF NOT EXISTS "happening" (
	"id" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"title" varchar NOT NULL,
	"type" "happening_type" DEFAULT 'event' NOT NULL,
	"date" timestamp,
	"registration_start" timestamp,
	"registration_end" timestamp,
	CONSTRAINT happening_id_pk PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "question" (
	"id" varchar NOT NULL,
	"title" text NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"type" "question_type" DEFAULT 'text' NOT NULL,
	"is_sensitive" boolean DEFAULT false NOT NULL,
	"options" json,
	"happening_id" varchar NOT NULL,
	CONSTRAINT question_id_pk PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "registration" (
	"user_id" text NOT NULL,
	"happening_id" text NOT NULL,
	"status" "registration_status" DEFAULT 'waiting' NOT NULL,
	"unregister_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT registration_user_id_happening_id_pk PRIMARY KEY("user_id","happening_id")
);
CREATE TABLE IF NOT EXISTS "session" (
	"session_token" text NOT NULL,
	"user_id" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT session_session_token_pk PRIMARY KEY("session_token")
);
CREATE TABLE IF NOT EXISTS "site_feedback" (
	"id" varchar NOT NULL,
	"name" varchar,
	"email" varchar,
	"message" text NOT NULL,
	"category" "feedback_category" NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT site_feedback_id_pk PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "spot_range" (
	"id" varchar NOT NULL,
	"happening_id" varchar NOT NULL,
	"spots" integer NOT NULL,
	"min_year" integer NOT NULL,
	"max_year" integer NOT NULL,
	CONSTRAINT spot_range_id_pk PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "users_to_groups" (
	"user_id" text NOT NULL,
	"group_id" varchar NOT NULL,
	"is_leader" boolean DEFAULT false NOT NULL,
	CONSTRAINT users_to_groups_user_id_group_id_pk PRIMARY KEY("user_id","group_id")
);
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
	CONSTRAINT user_id_pk PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "verification_token" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT verification_token_identifier_token_pk PRIMARY KEY("identifier","token")
);
CREATE TABLE IF NOT EXISTS "whitelist" (
	"email" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"reason" text NOT NULL,
	CONSTRAINT whitelist_email_pk PRIMARY KEY("email")
);
CREATE INDEX IF NOT EXISTS "question_idx" ON "answer" ("question_id");
CREATE INDEX IF NOT EXISTS "type_idx" ON "happening" ("type");
CREATE UNIQUE INDEX IF NOT EXISTS "slug_idx" ON "happening" ("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "happening_id_title" ON "question" ("title","happening_id");
CREATE INDEX IF NOT EXISTS "status_idx" ON "registration" ("status");
CREATE UNIQUE INDEX IF NOT EXISTS "happening_id_min_year_max_year" ON "spot_range" ("happening_id","min_year","max_year");
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "answer" ADD CONSTRAINT "answer_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "answer" ADD CONSTRAINT "answer_happening_id_happening_id_fk" FOREIGN KEY ("happening_id") REFERENCES "happening"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "answer" ADD CONSTRAINT "answer_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "group" ADD CONSTRAINT "group_leader_user_id_fk" FOREIGN KEY ("leader") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "question" ADD CONSTRAINT "question_happening_id_happening_id_fk" FOREIGN KEY ("happening_id") REFERENCES "happening"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "registration" ADD CONSTRAINT "registration_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "registration" ADD CONSTRAINT "registration_happening_id_happening_id_fk" FOREIGN KEY ("happening_id") REFERENCES "happening"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "spot_range" ADD CONSTRAINT "spot_range_happening_id_happening_id_fk" FOREIGN KEY ("happening_id") REFERENCES "happening"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "users_to_groups" ADD CONSTRAINT "users_to_groups_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "users_to_groups" ADD CONSTRAINT "users_to_groups_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_degree_id_degree_id_fk" FOREIGN KEY ("degree_id") REFERENCES "degree"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
ALTER TABLE "answer" ALTER COLUMN "happening_id" SET DATA TYPE varchar(255);
ALTER TABLE "answer" ALTER COLUMN "question_id" SET DATA TYPE varchar(255);
ALTER TABLE "degree" ALTER COLUMN "id" SET DATA TYPE varchar(255);
ALTER TABLE "degree" ALTER COLUMN "name" SET DATA TYPE varchar(255);
ALTER TABLE "group" ALTER COLUMN "id" SET DATA TYPE varchar(255);
ALTER TABLE "group" ALTER COLUMN "name" SET DATA TYPE varchar(255);
ALTER TABLE "happenings_to_groups" ALTER COLUMN "happening_id" SET DATA TYPE varchar(255);
ALTER TABLE "happenings_to_groups" ALTER COLUMN "group_id" SET DATA TYPE varchar(255);
ALTER TABLE "happening" ALTER COLUMN "id" SET DATA TYPE varchar(255);
ALTER TABLE "happening" ALTER COLUMN "slug" SET DATA TYPE varchar(255);
ALTER TABLE "happening" ALTER COLUMN "title" SET DATA TYPE varchar(255);
ALTER TABLE "question" ALTER COLUMN "id" SET DATA TYPE varchar(255);
ALTER TABLE "question" ALTER COLUMN "happening_id" SET DATA TYPE varchar(255);
ALTER TABLE "site_feedback" ALTER COLUMN "name" SET DATA TYPE varchar(255);
ALTER TABLE "site_feedback" ALTER COLUMN "email" SET DATA TYPE varchar(255);
ALTER TABLE "spot_range" ALTER COLUMN "id" SET DATA TYPE varchar(255);
ALTER TABLE "spot_range" ALTER COLUMN "happening_id" SET DATA TYPE varchar(255);
ALTER TABLE "users_to_groups" ALTER COLUMN "group_id" SET DATA TYPE varchar(255);
ALTER TABLE "user" ALTER COLUMN "alternative_email" SET DATA TYPE varchar(255);
ALTER TABLE "user" ALTER COLUMN "degree_id" SET DATA TYPE varchar(255);
ALTER TABLE "happening" ADD COLUMN "registration_groups" json;
ALTER TABLE "happening" ADD COLUMN "registration_start_groups" timestamp;ALTER TYPE "registration_status" ADD VALUE 'pending';DO $$ BEGIN
 ALTER TABLE "happenings_to_groups" ADD CONSTRAINT "happenings_to_groups_happening_id_happening_id_fk" FOREIGN KEY ("happening_id") REFERENCES "happening"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "happenings_to_groups" ADD CONSTRAINT "happenings_to_groups_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
ALTER TABLE "group" DROP CONSTRAINT "group_leader_user_id_fk";
ALTER TABLE "group" DROP COLUMN IF EXISTS "leader";ALTER TABLE "happenings_to_groups" DROP CONSTRAINT "happenings_to_groups_happening_id_happening_id_fk";
DO $$ BEGIN
 ALTER TABLE "happenings_to_groups" ADD CONSTRAINT "happenings_to_groups_happening_id_happening_id_fk" FOREIGN KEY ("happening_id") REFERENCES "happening"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
CREATE UNIQUE INDEX IF NOT EXISTS "unique_email_idx" ON "user" ("email");
CREATE UNIQUE INDEX IF NOT EXISTS "unique_alternative_email_idx" ON "user" ("alternative_email");DROP INDEX IF EXISTS "question_idx";
DROP INDEX IF EXISTS "type_idx";
DROP INDEX IF EXISTS "slug_idx";
DROP INDEX IF EXISTS "happening_id_title";
DROP INDEX IF EXISTS "status_idx";
DROP INDEX IF EXISTS "happening_id_min_year_max_year";
DROP INDEX IF EXISTS "unique_email_idx";
DROP INDEX IF EXISTS "unique_alternative_email_idx";ALTER TABLE "happening" ADD CONSTRAINT "happening_slug_unique" UNIQUE("slug");ALTER TABLE "account" DROP CONSTRAINT "account_user_id_user_id_fk";
ALTER TABLE "answer" DROP CONSTRAINT "answer_user_id_user_id_fk";
ALTER TABLE "happenings_to_groups" DROP CONSTRAINT "happenings_to_groups_happening_id_happening_id_fk";
ALTER TABLE "question" DROP CONSTRAINT "question_happening_id_happening_id_fk";
ALTER TABLE "registration" DROP CONSTRAINT "registration_user_id_user_id_fk";
ALTER TABLE "session" DROP CONSTRAINT "session_user_id_user_id_fk";
ALTER TABLE "spot_range" DROP CONSTRAINT "spot_range_happening_id_happening_id_fk";
ALTER TABLE "users_to_groups" DROP CONSTRAINT "users_to_groups_user_id_user_id_fk";
ALTER TABLE "user" DROP CONSTRAINT "user_degree_id_degree_id_fk";
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "answer" ADD CONSTRAINT "answer_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "happenings_to_groups" ADD CONSTRAINT "happenings_to_groups_happening_id_happening_id_fk" FOREIGN KEY ("happening_id") REFERENCES "happening"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "question" ADD CONSTRAINT "question_happening_id_happening_id_fk" FOREIGN KEY ("happening_id") REFERENCES "happening"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "registration" ADD CONSTRAINT "registration_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "spot_range" ADD CONSTRAINT "spot_range_happening_id_happening_id_fk" FOREIGN KEY ("happening_id") REFERENCES "happening"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "users_to_groups" ADD CONSTRAINT "users_to_groups_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_degree_id_degree_id_fk" FOREIGN KEY ("degree_id") REFERENCES "degree"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
CREATE TABLE IF NOT EXISTS "shopping_list_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS "users_to_shopping_list_items" (
	"user_id" text NOT NULL,
	"item_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_to_shopping_list_items_user_id_item_id_pk" PRIMARY KEY("user_id","item_id")
);
DO $$ BEGIN
 ALTER TABLE "shopping_list_item" ADD CONSTRAINT "shopping_list_item_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "users_to_shopping_list_items" ADD CONSTRAINT "users_to_shopping_list_items_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "users_to_shopping_list_items" ADD CONSTRAINT "users_to_shopping_list_items_item_id_shopping_list_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "shopping_list_item"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
CREATE TABLE IF NOT EXISTS "reaction" (
	"react_to_key" text NOT NULL,
	"emoji_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "reaction_react_to_key_emoji_id_user_id_pk" PRIMARY KEY("react_to_key","emoji_id","user_id")
);
DO $$ BEGIN
 ALTER TABLE "reaction" ADD CONSTRAINT "reaction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
CREATE TABLE IF NOT EXISTS "strike" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"strike_info_id" uuid NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL
);
CREATE TABLE IF NOT EXISTS "strike_info" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"happening_id" varchar(255) NOT NULL,
	"issuer_id" text NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
ALTER TABLE "user" ADD COLUMN "is_banned" boolean DEFAULT false NOT NULL;
ALTER TABLE "user" ADD COLUMN "banned_from_strike" integer;
CREATE INDEX IF NOT EXISTS "user_idx" ON "strike" ("user_id","id");
DO $$ BEGIN
 ALTER TABLE "strike" ADD CONSTRAINT "strike_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "strike" ADD CONSTRAINT "strike_strike_info_id_strike_info_id_fk" FOREIGN KEY ("strike_info_id") REFERENCES "strike_info"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "strike_info" ADD CONSTRAINT "strike_info_happening_id_happening_id_fk" FOREIGN KEY ("happening_id") REFERENCES "happening"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "strike_info" ADD CONSTRAINT "strike_info_issuer_id_user_id_fk" FOREIGN KEY ("issuer_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
ALTER TABLE "registration" ADD COLUMN "registration_changed_at" text;CREATE INDEX IF NOT EXISTS "slug_idx" ON "happening" ("slug");CREATE TABLE IF NOT EXISTS "comment" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"parent_comment_id" text,
	"user_id" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
ALTER TABLE "comment" ALTER COLUMN "user_id" DROP NOT NULL;
DO $$ BEGIN
 ALTER TABLE "comment" ADD CONSTRAINT "comment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
CREATE INDEX IF NOT EXISTS "post_idx" ON "comment" ("post_id");ALTER TABLE "registration" ADD COLUMN "prev_status" "registration_status";
ALTER TABLE "registration" ADD COLUMN "changed_at" timestamp;
ALTER TABLE "registration" ADD COLUMN "changed_by" text;
ALTER TABLE "registration" DROP COLUMN IF EXISTS "registration_changed_at";DROP INDEX IF EXISTS "post_idx";
DROP INDEX IF EXISTS "slug_idx";
DROP INDEX IF EXISTS "user_idx";
CREATE INDEX IF NOT EXISTS "post_idx" ON "comment" USING btree (post_id);
CREATE INDEX IF NOT EXISTS "slug_idx" ON "happening" USING btree (slug);
CREATE INDEX IF NOT EXISTS "user_idx" ON "strike" USING btree (user_id,id);CREATE TABLE IF NOT EXISTS "access_request" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "access_request_email_unique" UNIQUE("email")
);
CREATE TABLE IF NOT EXISTS "cache" (
	"key" text PRIMARY KEY NOT NULL,
	"value" json,
	"ttl" timestamp DEFAULT now() + interval '1 day' NOT NULL
);
ALTER TABLE "cache" RENAME TO "kv";
ALTER TABLE "kv" ALTER COLUMN "ttl" DROP NOT NULL;ALTER TABLE "reaction" DROP CONSTRAINT "reaction_user_id_user_id_fk";
ALTER TABLE "registration" DROP CONSTRAINT "registration_user_id_user_id_fk";
ALTER TABLE "users_to_groups" DROP CONSTRAINT "users_to_groups_user_id_user_id_fk";
ALTER TABLE "users_to_groups" DROP CONSTRAINT "users_to_groups_group_id_group_id_fk";
ALTER TABLE "shopping_list_item" DROP CONSTRAINT "shopping_list_item_user_id_user_id_fk";
ALTER TABLE "users_to_shopping_list_items" DROP CONSTRAINT "users_to_shopping_list_items_user_id_user_id_fk";
ALTER TABLE "strike" DROP CONSTRAINT "strike_user_id_user_id_fk";
ALTER TABLE "user" ADD COLUMN "last_sign_in_at" timestamp;
ALTER TABLE "user" ADD COLUMN "updated_at" timestamp;
ALTER TABLE "user" ADD COLUMN "created_at" timestamp;
DO $$ BEGIN
 ALTER TABLE "reaction" ADD CONSTRAINT "reaction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "registration" ADD CONSTRAINT "registration_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "users_to_groups" ADD CONSTRAINT "users_to_groups_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "users_to_groups" ADD CONSTRAINT "users_to_groups_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "shopping_list_item" ADD CONSTRAINT "shopping_list_item_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "users_to_shopping_list_items" ADD CONSTRAINT "users_to_shopping_list_items_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "strike" ADD CONSTRAINT "strike_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
CREATE INDEX IF NOT EXISTS "email_idx" ON "user" USING btree ("email");ALTER TABLE "user" ADD COLUMN "has_read_terms" boolean DEFAULT false NOT NULL;DO $$ BEGIN
 CREATE TYPE "public"."comment_action" AS ENUM('like', 'dislike');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
CREATE TABLE IF NOT EXISTS "comments_reactions" (
	"comment_id" text NOT NULL,
	"user_id" text NOT NULL,
	"type" "comment_action" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "comments_reactions_comment_id_user_id_pk" PRIMARY KEY("comment_id","user_id")
);
ALTER TABLE "user" ADD COLUMN "birthday" date;CREATE TABLE IF NOT EXISTS "ban_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"banned_by" text NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"expires_at" timestamp NOT NULL
);
CREATE TABLE IF NOT EXISTS "dot" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"count" integer NOT NULL,
	"reason" text NOT NULL,
	"striked_by" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL
);
DROP TABLE "strike";
DROP TABLE "strike_info";
DO $$ BEGIN
 ALTER TABLE "ban_info" ADD CONSTRAINT "ban_info_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "dot" ADD CONSTRAINT "dot_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "ban_info" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "user_strike_idx" ON "dot" USING btree ("user_id","id");
ALTER TABLE "user" DROP COLUMN IF EXISTS "is_banned";
ALTER TABLE "user" DROP COLUMN IF EXISTS "banned_from_strike";ALTER TABLE "user" ADD COLUMN "inactive_email_sent_at" timestamp;CREATE INDEX "alternative_email_idx" ON "user" USING btree ("alternative_email");
ALTER TABLE "user" ADD CONSTRAINT "user_alternative_email_unique" UNIQUE("alternative_email");ALTER TABLE "user" ADD COLUMN "alternative_email_verified_at" timestamp;ALTER TABLE "access_request" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "answer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ban_info" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "comments_reactions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "comment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "degree" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "dot" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "group" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "happenings_to_groups" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "happening" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "kv" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "question" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "reaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "registration" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "site_feedback" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "spot_range" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "users_to_groups" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "verification_token" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "shopping_list_item" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "users_to_shopping_list_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "whitelist" ENABLE ROW LEVEL SECURITY;ALTER TABLE "user" ADD COLUMN "is_public" boolean DEFAULT false NOT NULL;ALTER TABLE "verification_token" ADD COLUMN "code" text;
ALTER TABLE "verification_token" ADD COLUMN "used" boolean DEFAULT false NOT NULL;CREATE TABLE "quote" (
	"id" text PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"context" text,
	"person" text NOT NULL,
	"submitted_by" text NOT NULL,
	"submitted_at" timestamp NOT NULL
);
ALTER TABLE "quote" ENABLE ROW LEVEL SECURITY;CREATE TABLE "users_to_quotes" (
	"user_id" text NOT NULL,
	"quote_id" text NOT NULL,
	"reaction_type" text NOT NULL,
	CONSTRAINT "users_to_quotes_user_id_quote_id_pk" PRIMARY KEY("user_id","quote_id")
);
ALTER TABLE "users_to_quotes" ADD CONSTRAINT "users_to_quotes_quote_id_quote_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."quote"("id") ON DELETE cascade ON UPDATE no action;

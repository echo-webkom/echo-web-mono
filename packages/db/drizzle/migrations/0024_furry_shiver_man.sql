DO $$ BEGIN
 CREATE TYPE "public"."comment_action" AS ENUM('like', 'dislike');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comments_reactions" (
	"comment_id" text NOT NULL,
	"user_id" text NOT NULL,
	"type" "comment_action" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "comments_reactions_comment_id_user_id_pk" PRIMARY KEY("comment_id","user_id")
);

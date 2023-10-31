CREATE TABLE IF NOT EXISTS "shoppingList" (
	"item_id" integer PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"item_name" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shoppingList" ADD CONSTRAINT "shoppingList_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

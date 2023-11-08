CREATE TABLE IF NOT EXISTS "shopping_list_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
DROP TABLE "shoppingList";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shopping_list_item" ADD CONSTRAINT "shopping_list_item_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

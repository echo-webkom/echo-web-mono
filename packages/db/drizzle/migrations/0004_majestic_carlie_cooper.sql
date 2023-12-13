ALTER TABLE "shopping_list_likes" RENAME TO "users-to-shopping-list-items";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users-to-shopping-list-items" ADD CONSTRAINT "users-to-shopping-list-items_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users-to-shopping-list-items" ADD CONSTRAINT "users-to-shopping-list-items_item_shopping_list_item_id_fk" FOREIGN KEY ("item") REFERENCES "shopping_list_item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users-to-shopping-list-items" DROP COLUMN IF EXISTS "id";--> statement-breakpoint
ALTER TABLE "users-to-shopping-list-items" ADD CONSTRAINT "users-to-shopping-list-items_user_id_item" PRIMARY KEY("user_id","item");
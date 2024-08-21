ALTER TABLE "reaction" DROP CONSTRAINT "reaction_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "registration" DROP CONSTRAINT "registration_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "users_to_groups" DROP CONSTRAINT "users_to_groups_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "users_to_groups" DROP CONSTRAINT "users_to_groups_group_id_group_id_fk";
--> statement-breakpoint
ALTER TABLE "shopping_list_item" DROP CONSTRAINT "shopping_list_item_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "users_to_shopping_list_items" DROP CONSTRAINT "users_to_shopping_list_items_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "strike" DROP CONSTRAINT "strike_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "last_sign_in_at" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "created_at" timestamp;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reaction" ADD CONSTRAINT "reaction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "registration" ADD CONSTRAINT "registration_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_groups" ADD CONSTRAINT "users_to_groups_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_groups" ADD CONSTRAINT "users_to_groups_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shopping_list_item" ADD CONSTRAINT "shopping_list_item_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_shopping_list_items" ADD CONSTRAINT "users_to_shopping_list_items_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "strike" ADD CONSTRAINT "strike_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "user" USING btree ("email");
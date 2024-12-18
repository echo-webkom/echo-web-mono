ALTER TABLE "notification" DROP CONSTRAINT "notification_created_by_user_id_fk";
--> statement-breakpoint
ALTER TABLE "notification" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "notification" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "notification" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "notification" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "notification" DROP COLUMN IF EXISTS "created_by";
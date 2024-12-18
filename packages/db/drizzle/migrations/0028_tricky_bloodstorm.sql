CREATE TABLE IF NOT EXISTS "user_to_notification" (
	"notification_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "user_to_notification_notification_id_user_id_pk" PRIMARY KEY("notification_id","user_id")
);
--> statement-breakpoint
DROP TABLE "notification_recipient";--> statement-breakpoint
ALTER TABLE "notification" DROP CONSTRAINT "notification_user_id_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_to_notification" ADD CONSTRAINT "user_to_notification_notification_id_notification_id_fk" FOREIGN KEY ("notification_id") REFERENCES "public"."notification"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_to_notification" ADD CONSTRAINT "user_to_notification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "notification" DROP COLUMN IF EXISTS "user_id";
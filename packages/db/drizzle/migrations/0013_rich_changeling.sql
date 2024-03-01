CREATE TABLE IF NOT EXISTS "user_to_notification" (
	"user_id" text NOT NULL,
	"notification_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_to_notification_user_id_notification_id_pk" PRIMARY KEY("user_id","notification_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_to_notification" ADD CONSTRAINT "user_to_notification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

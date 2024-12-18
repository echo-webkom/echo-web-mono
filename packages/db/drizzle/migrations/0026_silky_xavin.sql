ALTER TABLE "notification_recipient" ALTER COLUMN "notification_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "notification_recipient" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'notification'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "notification" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "notification" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "notification" ALTER COLUMN "created_by" SET DATA TYPE text;
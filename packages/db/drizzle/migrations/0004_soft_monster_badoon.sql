ALTER TABLE "group" DROP CONSTRAINT "group_leader_user_id_fk";
--> statement-breakpoint
ALTER TABLE "group" DROP COLUMN IF EXISTS "leader";
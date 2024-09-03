ALTER TABLE "answer" ALTER COLUMN "happening_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "answer" ALTER COLUMN "question_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "degree" ALTER COLUMN "id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "degree" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "group" ALTER COLUMN "id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "group" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "happenings_to_groups" ALTER COLUMN "happening_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "happenings_to_groups" ALTER COLUMN "group_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "happening" ALTER COLUMN "id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "happening" ALTER COLUMN "slug" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "happening" ALTER COLUMN "title" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "question" ALTER COLUMN "id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "question" ALTER COLUMN "happening_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "site_feedback" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "site_feedback" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "spot_range" ALTER COLUMN "id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "spot_range" ALTER COLUMN "happening_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users_to_groups" ALTER COLUMN "group_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "alternative_email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "degree_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "happening" ADD COLUMN "registration_groups" json;--> statement-breakpoint
ALTER TABLE "happening" ADD COLUMN "registration_start_groups" timestamp;
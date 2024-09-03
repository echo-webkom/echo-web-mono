ALTER TABLE "account" DROP CONSTRAINT "account_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "answer" DROP CONSTRAINT "answer_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "happenings_to_groups" DROP CONSTRAINT "happenings_to_groups_happening_id_happening_id_fk";
--> statement-breakpoint
ALTER TABLE "question" DROP CONSTRAINT "question_happening_id_happening_id_fk";
--> statement-breakpoint
ALTER TABLE "registration" DROP CONSTRAINT "registration_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "session_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "spot_range" DROP CONSTRAINT "spot_range_happening_id_happening_id_fk";
--> statement-breakpoint
ALTER TABLE "users_to_groups" DROP CONSTRAINT "users_to_groups_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_degree_id_degree_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answer" ADD CONSTRAINT "answer_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "happenings_to_groups" ADD CONSTRAINT "happenings_to_groups_happening_id_happening_id_fk" FOREIGN KEY ("happening_id") REFERENCES "happening"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "question" ADD CONSTRAINT "question_happening_id_happening_id_fk" FOREIGN KEY ("happening_id") REFERENCES "happening"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "registration" ADD CONSTRAINT "registration_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "spot_range" ADD CONSTRAINT "spot_range_happening_id_happening_id_fk" FOREIGN KEY ("happening_id") REFERENCES "happening"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_groups" ADD CONSTRAINT "users_to_groups_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_degree_id_degree_id_fk" FOREIGN KEY ("degree_id") REFERENCES "degree"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

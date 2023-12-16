DO $$ BEGIN
 ALTER TABLE "happenings_to_groups" ADD CONSTRAINT "happenings_to_groups_happening_id_happening_id_fk" FOREIGN KEY ("happening_id") REFERENCES "happening"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "happenings_to_groups" ADD CONSTRAINT "happenings_to_groups_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

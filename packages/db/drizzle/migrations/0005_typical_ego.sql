ALTER TABLE "happenings_to_groups" DROP CONSTRAINT "happenings_to_groups_happening_id_happening_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "happenings_to_groups" ADD CONSTRAINT "happenings_to_groups_happening_id_happening_id_fk" FOREIGN KEY ("happening_id") REFERENCES "happening"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

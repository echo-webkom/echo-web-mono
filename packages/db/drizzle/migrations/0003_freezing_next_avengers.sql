CREATE TABLE IF NOT EXISTS "happenings_to_groups" (
	"happening_slug" varchar(255) NOT NULL,
	"group_id" varchar(21) NOT NULL,
	CONSTRAINT happenings_to_groups_happening_slug_group_id PRIMARY KEY("happening_slug","group_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "happenings_to_groups" ADD CONSTRAINT "happenings_to_groups_happening_slug_happening_slug_fk" FOREIGN KEY ("happening_slug") REFERENCES "happening"("slug") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "happenings_to_groups" ADD CONSTRAINT "happenings_to_groups_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

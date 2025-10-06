CREATE TABLE "office_booking" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"title" text DEFAULT 'Kontorplass' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "office_booking" ADD CONSTRAINT "office_booking_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
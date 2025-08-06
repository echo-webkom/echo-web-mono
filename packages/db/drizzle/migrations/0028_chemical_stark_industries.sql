CREATE INDEX "alternative_email_idx" ON "user" USING btree ("alternative_email");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_alternative_email_unique" UNIQUE("alternative_email");
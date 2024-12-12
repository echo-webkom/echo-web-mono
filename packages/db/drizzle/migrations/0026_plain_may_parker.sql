ALTER TABLE "session" DROP CONSTRAINT "session_session_token_pk";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_id_pk";--> statement-breakpoint
ALTER TABLE "session" ADD PRIMARY KEY ("session_token");--> statement-breakpoint
ALTER TABLE "user" ADD PRIMARY KEY ("id");
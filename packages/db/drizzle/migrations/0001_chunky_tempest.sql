ALTER TABLE "question" ALTER COLUMN "happening_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "question" ADD COLUMN "is_sensitive" boolean DEFAULT false NOT NULL;
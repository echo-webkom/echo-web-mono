ALTER TABLE "cache" RENAME TO "kv";--> statement-breakpoint
ALTER TABLE "kv" ALTER COLUMN "ttl" DROP NOT NULL;
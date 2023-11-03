CREATE TABLE IF NOT EXISTS "whitelist" (
	"email" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"reason" text NOT NULL,
	CONSTRAINT whitelist_email PRIMARY KEY("email")
);

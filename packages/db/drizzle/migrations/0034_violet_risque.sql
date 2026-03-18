CREATE TABLE "users_to_quotes" (
	"user_id" text NOT NULL,
	"quote_id" text NOT NULL,
	"reaction_type" text NOT NULL,
	CONSTRAINT "users_to_quotes_user_id_quote_id_pk" PRIMARY KEY("user_id","quote_id")
);

import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { boolean, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const verificationTokens = pgTable(
  "verification_token",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    code: text("code").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    used: boolean("used").notNull().default(false),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
).enableRLS();

export type VerificationToken = InferSelectModel<typeof verificationTokens>;
export type VerificationTokenInsert = InferInsertModel<typeof verificationTokens>;

export const selectVerificationTokenSchema = createSelectSchema(verificationTokens);
export const insertVerificationTokenSchema = createInsertSchema(verificationTokens);

import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const verificationTokens = sqliteTable(
  "verification_token",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export type VerificationToken = InferSelectModel<typeof verificationTokens>;
export type VerificationTokenInsert = InferInsertModel<typeof verificationTokens>;

export const selectVerificationTokenSchema = createSelectSchema(verificationTokens);
export const insertVerificationTokenSchema = createInsertSchema(verificationTokens);

import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { nanoid } from "nanoid";

import { feedbackCategoryEnum } from "./enums";

export const siteFeedback = sqliteTable(
  "site_feedback",
  {
    id: text("id").notNull().$defaultFn(nanoid),
    name: text("name"),
    email: text("email"),
    message: text("message").notNull(),
    category: text("category", { enum: feedbackCategoryEnum }).notNull(),
    isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
  }),
);

export type SiteFeedback = InferSelectModel<typeof siteFeedback>;
export type SiteFeedbackInsert = InferInsertModel<typeof siteFeedback>;

export const selectSiteFeedbackSchema = createSelectSchema(siteFeedback);
export const insertSiteFeedbackSchema = createInsertSchema(siteFeedback);

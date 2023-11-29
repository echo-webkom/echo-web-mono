import { boolean, pgTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { nanoid } from "nanoid";

import { feedbackCategoryEnum } from "./enums";

export const siteFeedback = pgTable(
  "site_feedback",
  {
    id: varchar("id")
      .notNull()
      .$defaultFn(() => nanoid()),
    name: varchar("name"),
    email: varchar("email"),
    message: text("message").notNull(),
    category: feedbackCategoryEnum("category").notNull(),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
  }),
);

export type SiteFeedback = (typeof siteFeedback)["$inferSelect"];
export type SiteFeedbackInsert = (typeof siteFeedback)["$inferInsert"];

export const selectSiteFeedbackSchema = createSelectSchema(siteFeedback);
export const insertSiteFeedbackSchema = createInsertSchema(siteFeedback);

import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { boolean, pgTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { nanoid } from "nanoid";

import { feedbackCategoryEnum } from "./enums";

export const siteFeedback = pgTable(
  "site_feedback",
  {
    id: varchar()
      .notNull()
      .$defaultFn(() => nanoid()),
    name: varchar({ length: 255 }),
    email: varchar({ length: 255 }),
    message: text().notNull(),
    category: feedbackCategoryEnum().notNull(),
    isRead: boolean().notNull().default(false),
    createdAt: timestamp().notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.id] })],
);

export type SiteFeedback = InferSelectModel<typeof siteFeedback>;
export type SiteFeedbackInsert = InferInsertModel<typeof siteFeedback>;

export const selectSiteFeedbackSchema = createSelectSchema(siteFeedback);
export const insertSiteFeedbackSchema = createInsertSchema(siteFeedback);

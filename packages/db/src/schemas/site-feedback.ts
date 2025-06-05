import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
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
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }),
    message: text("message").notNull(),
    category: feedbackCategoryEnum("category").notNull(),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.id] })],
);

export type SiteFeedback = InferSelectModel<typeof siteFeedback>;
export type SiteFeedbackInsert = InferInsertModel<typeof siteFeedback>;

export const selectSiteFeedbackSchema = createSelectSchema(siteFeedback);
export const insertSiteFeedbackSchema = createInsertSchema(siteFeedback);

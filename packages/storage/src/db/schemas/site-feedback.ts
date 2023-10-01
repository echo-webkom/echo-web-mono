import { boolean, pgTable, primaryKey, uuid, varchar } from "drizzle-orm/pg-core";

import { siteFeedbackTypeEnum } from "./enums";

export const siteFeedbacks = pgTable(
  "site_feedback",
  {
    id: uuid("id").notNull().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    feedback: varchar("feedback", { length: 5000 }).notNull(),
    type: siteFeedbackTypeEnum("type").notNull(),
    isRead: boolean("is_read").notNull().default(false),
  },
  (sf) => ({
    primaryKey: primaryKey(sf.id),
  }),
);

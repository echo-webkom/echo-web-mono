import { boolean, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const siteFeedback = pgTable("site_feedback", {
  id: varchar("id", { length: 21 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type SiteFeedback = (typeof siteFeedback)["$inferSelect"];
export type SiteFeedbackInsert = (typeof siteFeedback)["$inferInsert"];

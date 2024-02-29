import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

import { users } from "./users";

export const userToNotification = pgTable(
  "user_to_notification",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    notificationId: text("notification_id")
      .notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.notificationId] }),
  }),
);

export const userToNotificationRelations = relations(userToNotification, ({ one, many }) => ({
  user: one(users, {
    fields: [userToNotification.userId],
    references: [users.id],
  }),
}));

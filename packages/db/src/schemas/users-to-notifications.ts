import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { boolean, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { users } from ".";
import { notifications } from "./notifications";

export const usersToNotifications = pgTable(
  "user_to_notification",
  {
    notificationId: uuid("notification_id")
      .references(() => notifications.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    isRead: boolean("is_read").notNull().default(false),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.notificationId, table.userId] }),
  }),
);

export const usersToNotificationsRelations = relations(usersToNotifications, ({ one }) => ({
  user: one(users, {
    fields: [usersToNotifications.userId],
    references: [users.id],
  }),
  notification: one(notifications, {
    fields: [usersToNotifications.notificationId],
    references: [notifications.id],
  }),
}));

export type UsersToNotifications = InferSelectModel<typeof usersToNotifications>;
export type UsersToNotificationsInsert = InferInsertModel<typeof usersToNotifications>;

export const selectUsersToNotificationsSchema = createSelectSchema(usersToNotifications);
export const insertUsersToNotificationsSchema = createInsertSchema(usersToNotifications);
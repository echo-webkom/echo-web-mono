import { relations } from "drizzle-orm";
import { pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "./users";
import { userToNotification } from "./users-to-notification";

export const notifications = pgTable(
  "notification",
  {
    id: varchar("id", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
  }),
);

export const notificationRelations = relations(notifications, ({ many }) => ({
    haveRead: many(userToNotification),
}));

export type Notification = (typeof notifications)["$inferSelect"];
export type NotificationInsert = (typeof notifications)["$inferInsert"];

export const selectNotificationSchema = createSelectSchema(notifications);
export const insertNotificationSchema = createInsertSchema(notifications);

import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { date, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { users, usersToNotifications } from ".";

<<<<<<< HEAD
export const notifications = pgTable("notification", {
=======

export const notifications = pgTable("notifications", {
>>>>>>> 2b2bdb9dc36b8618834dea36bff783b7ea4b6e9a
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  dateFrom: date("date_from").notNull(),
  dateTo: date("date_to").notNull(),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
});

export const notificationsRelations = relations(notifications, ({ one, many }) => ({
  creator: one(users, {
    fields: [notifications.createdBy],
    references: [users.id],
  }),
  recipients: many(usersToNotifications),
}));

export type Notification = InferSelectModel<typeof notifications>;
export type NotificationInsert = InferInsertModel<typeof notifications>;

export const selectNotificationSchema = createSelectSchema(notifications);
export const insertNotificationSchema = createInsertSchema(notifications);
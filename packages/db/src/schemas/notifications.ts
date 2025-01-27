import { type InferInsertModel, type InferSelectModel, relations } from "drizzle-orm";
import { date, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { users, usersToNotifications } from ".";

export const notifications = pgTable("notification", {
  // Table name must be notification unless renaming current table
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

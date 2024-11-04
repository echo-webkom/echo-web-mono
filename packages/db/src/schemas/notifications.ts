import { date, integer, pgTable, primaryKey, serial, text } from "drizzle-orm/pg-core";
import { users } from "./users";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const notifications = pgTable("notification", {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    dateFrom: date('date_from').notNull(),
    dateTo: date('date_to').notNull(),
    createdBy: integer('created_by').references(() => users.id)
});

export const notificationRecipients = pgTable("notification_recipient", {
    notificationId: integer("notification_id").references(() => notifications.id).notNull(),
    userId: text("user_id").references(() => users.id).notNull(),

}, (table) => ({
    pk: primaryKey({ columns: [table.notificationId, table.userId]})
}));

export type Notification = InferSelectModel<typeof notifications>;
export type NotificationInsert = InferInsertModel<typeof notifications>;

export const selectNotificationSchema = createSelectSchema(notifications);
export const insertNotificationSchema = createInsertSchema(notifications);

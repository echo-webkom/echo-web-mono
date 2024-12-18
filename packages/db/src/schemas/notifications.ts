import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { date, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const notifications = pgTable("notification", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  dateFrom: date("date_from").notNull(),
  dateTo: date("date_to").notNull(),
});

export type Notification = InferSelectModel<typeof notifications>;
export type NotificationInsert = InferInsertModel<typeof notifications>;

export const selectNotificationSchema = createSelectSchema(notifications);
export const insertNotificationSchema = createInsertSchema(notifications);

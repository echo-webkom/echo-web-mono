import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { users } from ".";

export const officeBookings = pgTable("office_booking", {
  id: serial("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  title: text("title").notNull().default("Kontorplass"),
});

export const officeBookingRelations = relations(officeBookings, ({ one }) => ({
  user: one(users, {
    fields: [officeBookings.userId],
    references: [users.id],
  }),
}));

export type OfficeBooking = InferSelectModel<typeof officeBookings>;
export type OfficeBookingInsert = InferInsertModel<typeof officeBookings>;

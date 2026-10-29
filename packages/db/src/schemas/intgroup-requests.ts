import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const intgroupRequests = pgTable("intgroup_request", {
  id: text("id").primaryKey(),
  groupName: text("group_name").notNull(),
  description: text("description").notNull(),
  interestedPeople: text("interested_people").notNull(),
  purpose: text("purpose").notNull(),
  needsFromHovedstyre: text("needs_from_hovedstyre"),
  contactEmail: text("contact_email").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}).enableRLS();

export type IntgroupRequest = InferSelectModel<typeof intgroupRequests>;
export type IntgroupRequestInsert = InferInsertModel<typeof intgroupRequests>;

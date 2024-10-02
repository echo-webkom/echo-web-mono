import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { now } from "../utils";
import { inviteResponseEnum } from "./enums";
import { happenings } from "./happenings";
import { users } from "./users";

export const invitations = pgTable("invitation", {
  id: text("id").notNull(),
  happeningId: text("happening_id")
    .notNull()
    .references(() => happenings.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").$defaultFn(now),
  timeout: timestamp("timeout").notNull(),
  response: inviteResponseEnum("response").notNull().default("pending"),
});

export const invitationRelations = relations(invitations, ({ one }) => ({
  happening: one(happenings, {
    fields: [invitations.happeningId],
    references: [happenings.id],
  }),
  users: one(users, {
    fields: [invitations.userId],
    references: [users.id],
  }),
}));

export type Invitation = InferSelectModel<typeof invitations>;
export type InvitationInsert = InferInsertModel<typeof invitations>;

export const selectInvitationsSchema = createSelectSchema(invitations);
export const insertInvitationsSchema = createInsertSchema(invitations);

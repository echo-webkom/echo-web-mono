import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { users } from ".";

export const banInfos = pgTable(
  "ban_info",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    bannedBy: text("banned_by").notNull(),
    reason: text("reason").notNull(),
    createdAt: timestamp("created_at")
      .notNull()
      .$defaultFn(() => new Date()),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
  }),
);

export const banInfoRelations = relations(banInfos, ({ one }) => ({
  user: one(users, {
    fields: [banInfos.userId],
    references: [users.id],
    relationName: "banInfo",
  }),
  bannedByUser: one(users, {
    fields: [banInfos.bannedBy],
    references: [users.id],
  }),
}));

export type BanInfo = InferSelectModel<typeof banInfos>;
export type BanInfoInsert = InferInsertModel<typeof banInfos>;

export const selectBanInfoSchema = createSelectSchema(banInfos);
export const insertBanInfoSchema = createInsertSchema(banInfos);

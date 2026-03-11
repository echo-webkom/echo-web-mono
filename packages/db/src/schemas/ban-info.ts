import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { users } from "./users";

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
  (t) => [index("user_id_idx").on(t.userId)],
).enableRLS();

export type BanInfo = InferSelectModel<typeof banInfos>;
export type BanInfoInsert = InferInsertModel<typeof banInfos>;

export const selectBanInfoSchema = createSelectSchema(banInfos);
export const insertBanInfoSchema = createInsertSchema(banInfos);

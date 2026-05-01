import { pgTable, serial, timestamp, text, index } from "drizzle-orm/pg-core";

export const notifications = pgTable(
  "notification",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    content: text("content"),
    link: text("link"),
    type: text("type").notNull(),
    userId: text("user_id").notNull(),
    seenAt: timestamp("seen_at"),
    archivedAt: timestamp("archived_at"),
    createdAt: timestamp("created_at").notNull(),
  },
  (t) => [
    index("notification_user_id_idx").on(t.userId),
    index("notification_archived_at_idx").on(t.archivedAt),
  ],
);

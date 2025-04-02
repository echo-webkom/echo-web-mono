import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const trophies = pgTable("trophy", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => nanoid()),
  xp: integer("xp").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date()),
  color: text("color").notNull(),
  icon: text("icon").notNull(),
});

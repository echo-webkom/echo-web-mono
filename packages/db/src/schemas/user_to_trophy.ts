import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";

import { trophies } from "./trophies";
import { users } from "./users";

export const user_to_trophy = pgTable(
  "user_to_trophy",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    trophyId: text("trophy_id")
      .notNull()
      .references(() => trophies.id, {
        onDelete: "cascade",
      }),
  },
  (table) => ({ pk: primaryKey({ columns: [table.trophyId, table.userId] }) }),
);

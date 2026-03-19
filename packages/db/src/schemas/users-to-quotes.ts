import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { quotes } from "./quotes";

export const usersToQuotes = pgTable(
  "users_to_quotes",
  {
    userId: text("user_id").notNull(),
    quoteId: text("quote_id")
      .notNull()
      .references(() => quotes.id, {
        onDelete: "cascade",
      }),
    reactionType: text("reaction_type").notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.quoteId] })],
);

export type UsersToQuotes = InferSelectModel<typeof usersToQuotes>;
export type UsersToShoppingListItemsInsert = InferInsertModel<typeof usersToQuotes>;

export const selectUsersToQuotesSchema = createSelectSchema(usersToQuotes);
export const insertUsersToQuotesSchema = createInsertSchema(usersToQuotes);

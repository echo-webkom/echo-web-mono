import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { shoppingListItems, users } from ".";

export const shoppingListLikes = pgTable("shopping_list_likes", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull(),
    item: uuid("item")
        .notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  });

export const shoppingListLikesRelations = relations(shoppingListLikes, ({ many }) => ({
    users: many(users),
    shoppingListItems: many(shoppingListItems),
  }));


export type ShoppingListLikes = (typeof shoppingListLikes)["$inferSelect"];
export type ShoppingListLikesInsert = (typeof shoppingListLikes)["$inferInsert"];

export const selectShoppingListLikesSchema = createSelectSchema(shoppingListLikes);
export const insertShoppingListLikesSchema = createInsertSchema(shoppingListLikes);


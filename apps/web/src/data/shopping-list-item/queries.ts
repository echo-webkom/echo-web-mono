import { unstable_cache as cache } from "next/cache";

import { db } from "@echo-webkom/db";

import { cacheKeyFactory } from "./revalidations";

export const getAllShoppinglistItems = () => {
  return cache(
    async () => {
      return await db.query.shoppingListItems
        .findMany({
          with: { likes: true, user: true },
        })
        .catch(() => {
          console.error("Failed to fetch shopping list items");

          return [];
        });
    },
    [cacheKeyFactory.shoppinglistItems()],
    {
      tags: [cacheKeyFactory.shoppinglistItems()],
    },
  )();
};

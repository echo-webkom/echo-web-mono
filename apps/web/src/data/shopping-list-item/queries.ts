import { unstable_cache as cache } from "next/cache";

import { db } from "@echo-webkom/db";

import { Logger } from "@/lib/logger";
import { cacheKeyFactory } from "./revalidations";

export function getAllShoppinglistItems() {
  return cache(
    async () => {
      return await db.query.shoppingListItems
        .findMany({
          with: { likes: true, user: true },
        })
        .catch(() => {
          Logger.error(getAllShoppinglistItems.name, "Failed to fetch shopping list items");

          return [];
        });
    },
    [cacheKeyFactory.shoppinglistItems()],
    {
      tags: [cacheKeyFactory.shoppinglistItems()],
    },
  )();
}

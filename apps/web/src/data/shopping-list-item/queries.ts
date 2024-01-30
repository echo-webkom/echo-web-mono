import { unstable_cache as cache } from "next/cache";

import { db } from "@echo-webkom/db";

import { cacheKeyFactory } from "./revalidations";

export function getAllShoppinglistItems() {
  return cache(
    async () => {
      return await db.query.shoppingListItems.findMany({
        with: { likes: true },
      });
    },
    [cacheKeyFactory.shoppinglistItems()],
    {
      tags: [cacheKeyFactory.shoppinglistItems()],
    },
  )();
}

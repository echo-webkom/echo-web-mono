import { revalidateTag } from "next/cache";

export const cacheKeyFactory = {
  shoppinglistItems: () => "shopping-list-items",
};

export function revalidateShoppingListItems() {
  revalidateTag(cacheKeyFactory.shoppinglistItems());
}

import { revalidateTag } from "next/cache";

export const cacheKeyFactory = {
  shoppinglistItems: () => "shopping-list-items",
};

export const revalidateShoppingListItems = () => {
  revalidateTag(cacheKeyFactory.shoppinglistItems());
};

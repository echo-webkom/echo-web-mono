import {
  type ShoppingListItems,
  type User,
  type UsersToShoppingListItems,
} from "@echo-webkom/db/schemas";

import { apiServer } from "@/api/server";

export const getAllShoppinglistItems = async () => {
  try {
    return await apiServer.get("shopping").json<
      Array<
        ShoppingListItems & {
          user: User;
          likes: Array<UsersToShoppingListItems>;
        }
      >
    >();
  } catch (err) {
    console.error("Error fetching shopping list items", err);

    return [];
  }
};

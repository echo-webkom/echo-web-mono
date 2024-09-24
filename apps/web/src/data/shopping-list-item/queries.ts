import {
  type ShoppingListItems,
  type User,
  type UsersToShoppingListItems,
} from "@echo-webkom/db/schemas";

import { apiServer } from "@/api/server";

export const getAllShoppinglistItems = () => {
  return apiServer
    .get("shopping")
    .json<
      Array<
        ShoppingListItems & {
          user: User;
          likes: Array<UsersToShoppingListItems>;
        }
      >
    >()
    .catch((err) => {
      console.error("Error fetching shopping list items", err);

      return [];
    });
};

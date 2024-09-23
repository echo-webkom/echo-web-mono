import {
  type ShoppingListItems,
  type User,
  type UsersToShoppingListItems,
} from "@echo-webkom/db/schemas";

import { apiClient } from "@/api/client";

export const getAllShoppinglistItems = () => {
  return apiClient
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

import { unoWithAdmin } from "@/api/server";

export const getAllShoppinglistItems = async () => {
  try {
    return await unoWithAdmin.shopping.items();
  } catch (err) {
    console.error("Error fetching shopping list items", err);

    return [];
  }
};

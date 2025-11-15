import { apiServer } from "@/api/server";

export const getAllShoppinglistItems = async () => {
  try {
    return await apiServer.get("shopping").json<
      Array<{
        createdAt: Date;
        id: string;
        likes: Array<string>;
        name: string;
        userId: string;
        userName: string | null;
      }>
    >();
  } catch (err) {
    console.error("Error fetching shopping list items", err);

    return [];
  }
};

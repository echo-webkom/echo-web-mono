import { revalidateTag } from "next/cache";

export const cacheKeyFactory = {
  allUsersWithStrikes: () => `strikes-user-all`,
  singleUserStrikes: (id: string) => `strikes-user-${id}`,
};

export const revalidateStrikes = (userId: string) => {
  revalidateTag(cacheKeyFactory.allUsersWithStrikes());
  revalidateTag(cacheKeyFactory.singleUserStrikes(userId));
};

import { revalidateTag } from "next/cache";

export const cacheKeyFactory = {
  allUsersStrikes: () => `strikes-user-all`,
  singleUserStrikes: (id: string) => `strikes-user-${id}`,
};

export function revalidateStrikes(userId: string) {
  revalidateTag(cacheKeyFactory.allUsersStrikes());
  revalidateTag(cacheKeyFactory.singleUserStrikes(userId));
}

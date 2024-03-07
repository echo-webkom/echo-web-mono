import { revalidateTag } from "next/cache";

export const cacheKeyFactory = {
  allUsersStrikes: () => `strikes-user-all`,
};

export function revalidateStrikes() {
  revalidateTag(cacheKeyFactory.allUsersStrikes());
}

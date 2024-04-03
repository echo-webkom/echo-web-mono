import { revalidateTag } from "next/cache";

export const cacheKeyFactory = {
  groups: "groups",
};

export function revalidateGroups() {
  revalidateTag(cacheKeyFactory.groups);
}

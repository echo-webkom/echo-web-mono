import { revalidateTag } from "next/cache";

export const cacheKeyFactory = {
  groups: "groups",
};

export const revalidateGroups = () => {
  revalidateTag(cacheKeyFactory.groups);
};

import { revalidateTag } from "next/cache";

export const cacheKeyFactory = {
  reactions: (id: string) => `reactions-${id}`,
};

export const revalidateReactions = (happeningId: string) => {
  revalidateTag(cacheKeyFactory.reactions(happeningId), "max");
};

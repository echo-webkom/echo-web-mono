import { revalidateTag } from "next/cache";

export const cacheKeyFactory = {
  comments: (id: string) => `comments_${id}`,
};

export const revalidateComments = (id: string) => {
  revalidateTag(cacheKeyFactory.comments(id));
};

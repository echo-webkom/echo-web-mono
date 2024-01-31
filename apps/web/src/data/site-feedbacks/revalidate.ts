import { revalidateTag } from "next/cache";

export const cacheKeyFactory = {
  siteFeedbacks: "site-feedbacks",
};

export const revalidateSiteFeedbacks = () => {
  revalidateTag(cacheKeyFactory.siteFeedbacks);
};

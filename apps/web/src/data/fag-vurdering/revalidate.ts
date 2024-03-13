import { revalidateTag } from "next/cache";

export const cacheKeyFactory = {
  subjectReviews: () => "subject-reviews",
};

export function revalidateSubjectReviews() {
  revalidateTag(cacheKeyFactory.subjectReviews());
}

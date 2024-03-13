import { db } from "@echo-webkom/db";
import { subjectReviews, type SubjectReviewtInsert } from "@echo-webkom/db/schemas";

import { revalidateSubjectReviews } from "./revalidate";

export async function createSubjectReview(newReview: SubjectReviewtInsert) {
  const [insertedSubjectReview] = await db
    .insert(subjectReviews)
    .values(newReview)
    .returning({ subjectCode: subjectReviews.subjectCode });
  revalidateSubjectReviews();

  return insertedSubjectReview;
}

import { type InferInsertModel } from "drizzle-orm";

import { db, happenings, questions, spotRanges } from "@echo-webkom/storage";

import { slugify } from "@/lib/slugify";

type InsertHappeningOptions = Partial<
  InferInsertModel<typeof happenings> & {
    qts?: Array<Omit<InferInsertModel<typeof questions>, "happeningSlug" | "id">>;
    srs?: Array<Omit<InferInsertModel<typeof spotRanges>, "happeningSlug" | "id">>;
  }
>;

const today = new Date();
const defaultDate = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() + 5,
  19,
  0,
  0,
  0,
);
const defaultEnd = new Date(defaultDate.setHours(defaultDate.getHours() - 2));

export const insertTestHappening = async ({
  slug = "test-happening",
  title = "Test happening",
  type = "bedpres",
  date = defaultDate,
  registrationStart = new Date(),
  registrationEnd = defaultEnd,
  srs = [],
  qts = [],
}: InsertHappeningOptions = {}) => {
  const happening = (
    await db
      .insert(happenings)
      .values({
        slug: slugify(slug),
        title,
        type,
        date,
        registrationStart,
        registrationEnd,
      })
      .returning()
  )[0];

  if (!happening) {
    throw new Error("Happening not created");
  }

  const happeningSpotRanges =
    srs.length > 0
      ? await db
          .insert(spotRanges)
          .values(srs.map((sr) => ({ ...sr, happeningSlug: happening.slug })))
          .returning()
      : [];

  const happeningQuestions =
    qts.length > 0
      ? await db
          .insert(questions)
          .values(
            qts.map((qt) => ({
              ...qt,
              happeningSlug: happening.slug,
            })),
          )
          .returning()
      : [];

  return {
    ...happening,
    spotRanges: happeningSpotRanges,
    questions: happeningQuestions,
  };
};

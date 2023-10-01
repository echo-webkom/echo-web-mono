import { createClient } from "@sanity/client";
import { sql } from "drizzle-orm";
import { Handler } from "hono";

import { numberToYear } from "@echo-webkom/lib";
import { db, happenings, questions, spotRanges } from "@echo-webkom/storage";

export const projectId = "nnumy1ga";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
export const apiVersion = "2023-05-03";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

const happeningQuery = `
*[_type == "event" || _type == "bedpres"
  && !(_id in path('drafts.**'))] {
  _type,
  title,
  "slug": slug.current,
  "date": dates.date,
  "registrationStart": dates.registrationStart,
  "registrationEnd": dates.registrationEnd,
  "spotRanges": spotRanges[] {
    spots,
    minDegreeYear,
    maxDegreeYear,
  },
  "questions": additionalQuestions[] {
    title,
    required,
    type,
    options,
  }
}
`;

type HappeningQueryType = Array<{
  _type: "event" | "bedpres";
  title: string;
  slug: string;
  date: string;
  registrationStart: string;
  registrationEnd: string;
  spotRanges: Array<{
    spots: number;
    minDegreeYear: number;
    maxDegreeYear: number;
  }> | null;
  questions: Array<{
    title: string;
    required: boolean;
    type: string;
    options: Array<string>;
  }> | null;
}>;

export const handleSyncSanity: Handler = async (c) => {
  const res = await sanityClient.fetch<HappeningQueryType>(happeningQuery);

  const formattedHappenings = res.map((h) => ({
    ...h,
    date: new Date(h.date),
    registrationStart: new Date(h.registrationStart),
    registrationEnd: new Date(h.registrationEnd),
  }));

  await db
    .insert(happenings)
    .values(
      formattedHappenings.map((h) => ({
        slug: h.slug,
        title: h.title,
        type: h._type,
        date: h.date,
        registrationStart: h.registrationStart,
        registrationEnd: h.registrationEnd,
      })),
    )
    .onConflictDoUpdate({
      target: [happenings.slug],
      set: {
        title: sql`excluded."title"`,
        type: sql`excluded."type"`,
        date: sql`excluded."date"`,
        registrationStart: sql`excluded."registration_start"`,
        registrationEnd: sql`excluded."registration_end"`,
        slug: sql`excluded."slug"`,
      },
    });

  await db.execute(sql`TRUNCATE TABLE spot_range CASCADE;`);

  const spotRangesToInsert = formattedHappenings.flatMap((h) => {
    return (h.spotRanges ?? []).map((sr) => {
      return {
        happeningSlug: h.slug,
        spots: sr.spots,
        minYear: numberToYear(sr.minDegreeYear),
        maxYear: numberToYear(sr.maxDegreeYear),
      };
    });
  });

  if (spotRangesToInsert.length > 0) {
    await db.insert(spotRanges).values(spotRangesToInsert);
  }

  await db.execute(sql`TRUNCATE TABLE question CASCADE;`);

  const questionsToInsert = formattedHappenings.flatMap((h) => {
    return (h.questions ?? []).map((q) => {
      return {
        happeningSlug: h.slug,
        title: q.title,
        required: q.required,
        type: "text" as const,
        options: [],
      };
    });
  });

  if (questionsToInsert.length > 0) {
    await db.insert(questions).values(questionsToInsert);
  }

  return c.text("ok");
};

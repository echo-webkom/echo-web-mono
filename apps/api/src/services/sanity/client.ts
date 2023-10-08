import { createClient } from "@sanity/client";

export const projectId = "nnumy1ga";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
export const apiVersion = "2023-05-03";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

export const happeningQuery = `
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

export type HappeningQueryType = Array<{
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

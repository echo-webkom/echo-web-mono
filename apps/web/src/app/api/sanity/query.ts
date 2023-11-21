import { groq } from "next-sanity";

export const happeningQuery = groq`
*[(_type == "event" || _type == "bedpres")
  && _id == $id
  && !(_id in path('drafts.**'))] {
  _id,
  _type,
  title,
  "slug": slug.current,
  "date": dates.date,
  "registrationStart": dates.registrationStart,
  "registrationEnd": dates.registrationEnd,
  "groups": organizer[]->slug.current,
  "spotRanges": spotRanges[] {
    spots,
    minYear,
    maxYear,
  },
  "questions": additionalQuestions[] {
    id,
    title,
    required,
    type,
    options,
  }
}[0]
`;

export type SanityHappening = {
  _id: string;
  _type: "event" | "bedpres";
  title: string;
  slug: string;
  date: string;
  registrationStart: string | null;
  registrationEnd: string | null;
  groups: Array<string>;
  spotRanges: Array<{
    spots: number;
    minYear: number;
    maxYear: number;
  }> | null;
  questions: Array<{
    id: string;
    title: string;
    required: boolean;
    type: "text" | "textarea" | "checkbox" | "radio";
    options: Array<string> | null;
  }> | null;
};

export type HappeningQueryType = SanityHappening | null;

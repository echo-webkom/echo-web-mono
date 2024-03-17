import groq from "groq";

const happeningQueryPartial = groq`
  _id,
  title,
  "slug": slug.current,
  "date": date,
  happeningType,
  "registrationStartGroups": registrationStartGroups,
  "registrationGroups": registrationGroups[]->slug.current,
  "registrationStart": registrationStart,
  "registrationEnd": registrationEnd,
  "groups": organizers[]->slug.current,
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
    isSensitive,
    options,
  }
`;

export const happeningQuerySingle = groq`
*[_type == "happening"
  && _id == $id
  && !(_id in path('drafts.**'))] {
  ${happeningQueryPartial}
}[0]
`;

export const happeningQueryList = groq`
*[_type == "happening"
  && !(_id in path('drafts.**'))] {
  ${happeningQueryPartial}
}
`;

export type SanityHappening = {
  _id: string;
  title: string;
  slug: string;
  date: string;
  happeningType: "event" | "bedpres" | "external";
  registrationStartGroups: string | null;
  registrationGroups: Array<string> | null;
  registrationStart: string | null;
  registrationEnd: string | null;
  groups: Array<string> | null;
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
    isSensitive: boolean;
    options: Array<string> | null;
  }> | null;
};

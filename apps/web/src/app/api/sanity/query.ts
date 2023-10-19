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
    minYear,
    maxYear,
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
    minYear: number;
    maxYear: number;
  }> | null;
  questions: Array<{
    title: string;
    required: boolean;
    type: "text" | "textarea" | "checkbox" | "radio";
    options: Array<string> | null;
  }> | null;
}>;

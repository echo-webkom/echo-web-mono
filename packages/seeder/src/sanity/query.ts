import groq from "groq";

import { type HappeningType, type QuestionType } from "@echo-webkom/lib";

export type SanityHappening = {
  _id: string;
  title: string;
  slug: string;
  date: string;
  happeningType: HappeningType;
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
    type: QuestionType;
    isSensitive: boolean;
    options: Array<string> | null;
  }> | null;
};

export const happeningQueryList = groq`*[_type == "happening" && !(_id in path('drafts.**'))] {
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
}
`;

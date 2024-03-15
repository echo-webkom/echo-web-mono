export const PAGE_TYPES = [
  { title: "For studenter", value: "for-students" },
  { title: "For bedrifter", value: "for-companies" },
  { title: "Om oss", value: "about" },
] as const;

export type PageType = (typeof PAGE_TYPES)[number]["value"];

export const GROUP_TYPES = [
  { title: "Hovedstyre", value: "board" },
  { title: "Undergruppe", value: "subgroup" },
  { title: "Underorganisasjon", value: "suborg" },
  { title: "Interessegruppe", value: "intgroup" },
  { title: "Idrettslag", value: "sport" },
  { title: "Skjult", value: "hidden" },
] as const;

export type StudentGroupType = (typeof GROUP_TYPES)[number]["value"];

export const HAPPENING_TYPES = [
  { title: "Arrangement", value: "event" },
  { title: "Bedriftspresentasjon", value: "bedpres" },
  { title: "Ekstern", value: "external" },
] as const;

export type HappeningType = (typeof HAPPENING_TYPES)[number]["value"];

export const JOB_TYPES = [
  { title: "Fulltid", value: "fulltime" },
  { title: "Deltid", value: "parttime" },
  { title: "Internship", value: "internship" },
  { title: "Sommerjobb", value: "summerjob" },
  { title: "Event", value: "event" },
  { title: "Annonse", value: "ad" },
] as const;

export type JobType = (typeof JOB_TYPES)[number]["value"];

export type StrikeType =
  | "UNREGISTER_BEFORE_DEADLINE"
  | "UNREGISTER_AFTER_DEADLINE"
  | "NO_SHOW"
  | "WRONG_INFO"
  | "TOO_LATE"
  | "NO_FEEDBACK"
  | "OTHER";

export const STRIKE_TYPE_MESSAGE: Record<StrikeType, string> = {
  UNREGISTER_BEFORE_DEADLINE: "Du meldte deg av før påmeldingsfristen.",
  UNREGISTER_AFTER_DEADLINE: "Du meldte deg av etter påmeldingsfristen.",
  NO_SHOW: "Du møtte ikke opp.",
  WRONG_INFO: "Du ga feil informasjon.",
  TOO_LATE: "Du kom for sent.",
  NO_FEEDBACK: "Du ga ikke tilbakemelding.",
  OTHER: "",
};

export const STRIKE_TYPE_AMOUNT: Record<StrikeType, number> = {
  UNREGISTER_AFTER_DEADLINE: 2,
  UNREGISTER_BEFORE_DEADLINE: 1,
  NO_SHOW: 1,
  WRONG_INFO: 1,
  TOO_LATE: 1,
  NO_FEEDBACK: 1,
  OTHER: 1,
};

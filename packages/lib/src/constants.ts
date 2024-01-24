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

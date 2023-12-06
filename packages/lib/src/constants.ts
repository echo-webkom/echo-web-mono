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
] as const;

export type StudentGroupType = (typeof GROUP_TYPES)[number]["value"];

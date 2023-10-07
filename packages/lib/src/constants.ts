import { type Group } from "@echo-webkom/db";

export const PAGE_TYPES = [
  { title: "Om oss", value: "ABOUT" },
  { title: "For studenter", value: "STUDENTS" },
  { title: "For bedrifter", value: "COMPANIES" },
] as const;

export type PageType = (typeof PAGE_TYPES)[number]["value"];

export const groupNames = {
  MAKERSPACE: "Makerspace",
  BOARD: "Hovedstyret",
  TILDE: "Tilde",
  GNIST: "Gnist",
  BEDKOM: "Bedkom",
  ESC: "ESC",
  HYGGKOM: "Hyggkom",
  WEBKOM: "Webkom",
  PROGBAR: "Programmerbar",
  SQUASH: "Squash",
} satisfies Record<Group, string>;

export const GROUP_TYPES = [
  { title: "Hovedstyre", value: "BOARD" },
  { title: "Undergruppe", value: "SUBGROUP" },
  { title: "Underorganisasjon", value: "SUBORG" },
  { title: "Interessegruppe", value: "INTGROUP" },
  { title: "Idrettslag", value: "SPORT" },
] as const;

export type StudentGroupType = (typeof GROUP_TYPES)[number]["value"];

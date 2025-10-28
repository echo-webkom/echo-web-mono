import {
  LuAtom,
  LuBriefcase,
  LuBuilding2,
  LuCalendarDays,
  LuCircleDollarSign,
  LuGraduationCap,
  LuHeart,
  LuMailOpen,
  LuMartini,
  LuMegaphone,
  LuPresentation,
  LuScale,
  LuScrollText,
  LuShirt,
  LuShoppingCart,
  LuStickyNote,
  LuUsers,
  LuWallet,
} from "react-icons/lu";

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

export const GROUP_PATH_TO_TYPE: Record<string, StudentGroupType> = {
  hovedstyre: "board",
  undergrupper: "subgroup",
  underorganisasjoner: "suborg",
  interessegrupper: "intgroup",
  idrettslag: "sport",
};

export const GROUP_TYPE_TO_PATH = Object.fromEntries(
  Object.entries(GROUP_PATH_TO_TYPE).map(([key, value]) => [value, key]),
);

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

export const QUESTION_TYPES = [
  { title: "Tekstfelt", value: "text" },
  { title: "Stort tekstfelt", value: "textarea" },
  { title: "Sjekkbokser", value: "checkbox" },
  { title: "Valg", value: "radio" },
] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number]["value"];

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

export const GROUPS = {
  WEBKOM: "webkom",
  HOVEDSTYRET: "hovedstyret",
  BEDKOM: "bedkom",
  GNIST: "gnist",
  MAKERSPACE: "makerspace",
  TILDE: "tilde",
  HYGGKOM: "hyggkom",
  ESC: "esc",
  PROGRAMMERBAR: "programmerbar",
  ESCSQUASH: "esc-squash",
  ESCFOTBALL: "esc-fotball",
  BRYGGELAGET: "bryggelaget",
} as const;

export type Group = (typeof GROUPS)[keyof typeof GROUPS] | (string & NonNullable<unknown>);

export const HEADER_ICONS = [
  { title: "Atom", value: "LuAtom", icon: LuAtom },
  { title: "Briefcase", value: "LuBriefcase", icon: LuBriefcase },
  { title: "Building2", value: "LuBuilding2", icon: LuBuilding2 },
  { title: "CalendarDays", value: "LuCalendarDays", icon: LuCalendarDays },
  { title: "CircleDollarSign", value: "LuCircleDollarSign", icon: LuCircleDollarSign },
  { title: "GraduationCap", value: "LuGraduationCap", icon: LuGraduationCap },
  { title: "Heart", value: "LuHeart", icon: LuHeart },
  { title: "MailOpen", value: "LuMailOpen", icon: LuMailOpen },
  { title: "Martini", value: "LuMartini", icon: LuMartini },
  { title: "Megaphone", value: "LuMegaphone", icon: LuMegaphone },
  { title: "Presentation", value: "LuPresentation", icon: LuPresentation },
  { title: "Scale", value: "LuScale", icon: LuScale },
  { title: "ScrollText", value: "LuScrollText", icon: LuScrollText },
  { title: "Shirt", value: "LuShirt", icon: LuShirt },
  { title: "ShoppingCart", value: "LuShoppingCart", icon: LuShoppingCart },
  { title: "StickyNote", value: "LuStickyNote", icon: LuStickyNote },
  { title: "Users", value: "LuUsers", icon: LuUsers },
  { title: "Wallet", value: "LuWallet", icon: LuWallet },
];

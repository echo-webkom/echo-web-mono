import { JOB_TYPES, type JobType, type PageType, type StudentGroupType } from "@echo-webkom/lib";

export const jobTypeString = (type: JobType) =>
  JOB_TYPES.find((t) => t.value === type)?.title ?? type;

export const studentGroupTypeName: Record<StudentGroupType, string> = {
  board: "Hovedstyre",
  subgroup: "Undergrupper",
  intgroup: "Interessegrupper",
  suborg: "Underorganisasjoner",
  sport: "Idrettslag",
  hidden: "Skjult",
} as const;

export const pageTypeToUrl: Record<PageType, string> = {
  about: "om",
  "for-companies": "for-bedrifter",
  "for-students": "for-studenter",
};

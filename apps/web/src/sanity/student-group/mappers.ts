import { type StudentGroupType } from "@echo-webkom/lib";

export const studentGroupTypeName: Record<StudentGroupType, string> = {
  board: "Hovedstyre",
  subgroup: "Undergrupper",
  intgroup: "Interessegrupper",
  suborg: "Underorganisasjoner",
  sport: "Idrettslag",
  hidden: "Skjult",
} as const;

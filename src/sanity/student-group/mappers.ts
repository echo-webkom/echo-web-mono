import { StudentGroupType } from "@/constants";

export const studentGroupTypeName: Record<StudentGroupType, string> = {
  board: "Hovedstyre",
  subgroup: "Undergrupper",
  intgroup: "Interessegrupper",
  suborg: "Underorganisasjoner",
  sport: "Idrettslag",
  hidden: "Skjult",
} as const;

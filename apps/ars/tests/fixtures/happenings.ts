import { type DBHappening } from "../../src/queries";

export const bedpres = {
  id: "bedpres",
  type: "bedpres",
  date: new Date("2023-01-04"),
  registrationStart: new Date("2023-01-01"),
  registrationEnd: new Date("2023-01-03"),
  registrationGroups: ["webkom"],
  spotRanges: [
    {
      happeningId: "bedpres",
      spots: 1,
      minYear: 1,
      maxYear: 5,
      id: "1",
    },
  ],
  questions: [],
} satisfies DBHappening;

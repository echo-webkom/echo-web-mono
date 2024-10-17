import { addDays, subDays } from "date-fns";

import { happenings } from "@echo-webkom/db/schemas";

import { db } from "@/lib/db";

export async function givenIHaveHappenings() {
  await db.insert(happenings).values([
    {
      id: "1",
      title: "Happening 1",
      slug: "happening-1",
      date: addDays(new Date(), 3),
      registrationStart: subDays(new Date(), 2),
      registrationEnd: addDays(new Date(), 2),
      type: "bedpres",
    },
    {
      id: "2",
      title: "Happening 2",
      slug: "happening-2",
      date: new Date(),
      registrationStart: subDays(new Date(), 3),
      registrationEnd: subDays(new Date(), 1),
      type: "bedpres",
    },
  ]);
}

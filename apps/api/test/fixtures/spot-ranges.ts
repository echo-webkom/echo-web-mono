import { spotRanges } from "@echo-webkom/db/schemas";

import { db } from "@/lib/db";

export async function givenIHaveSpotranges() {
  await db.insert(spotRanges).values([
    {
      happeningId: "1",
      minYear: 1,
      maxYear: 5,
      spots: 3,
    },
    {
      happeningId: "1",
      minYear: 4,
      maxYear: 5,
      spots: 1,
    },
  ]);
}

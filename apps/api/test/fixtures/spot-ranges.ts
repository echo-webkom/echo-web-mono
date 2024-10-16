import { spotRanges } from "@echo-webkom/db/schemas";

import { db } from "@/lib/db";

export async function givenIHaveOverlappingSpotRanges() {
  await db.insert(spotRanges).values([
    {
      happeningId: "1",
      minYear: 1,
      maxYear: 5,
      spots: 1,
    },
    {
      happeningId: "1",
      minYear: 4,
      maxYear: 5,
      spots: 1,
    },
  ]);
}

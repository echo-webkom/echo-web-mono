import { degrees } from "@echo-webkom/db/schemas";

import { db } from "@/lib/db";

export async function givenIHaveDegrees() {
  await db
    .insert(degrees)
    .values([
      {
        id: "dtek",
        name: "Datateknologi",
      },
      {
        id: "dsik",
        name: "Datasikkerhet",
      },
    ])
    .onConflictDoNothing();
}

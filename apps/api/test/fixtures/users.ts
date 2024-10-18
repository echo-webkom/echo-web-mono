import { users } from "@echo-webkom/db/schemas";

import { db } from "@/lib/db";
import { givenIHaveDegrees } from "./degrees";

export async function givenIHaveUsers() {
  await givenIHaveDegrees();

  await db
    .insert(users)
    .values([
      {
        id: "1",
        name: "Andreas Aanes",
        email: "andreas@echo.uib.no",
        year: 3,
        degreeId: "dtek",
        hasReadTerms: true,
      },
      {
        id: "2",
        name: "Bo Bakseter",
        email: "bo@echo.uib.no",
        year: 5,
        degreeId: "dtek",
        hasReadTerms: true,
      },
    ])
    .onConflictDoNothing();
}

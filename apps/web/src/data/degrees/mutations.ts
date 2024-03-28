import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { degrees, type Degree, type DegreeInsert } from "@echo-webkom/db/schemas";

import { revalidateDegrees } from "./revalidate";

export async function createDegree(newDegree: DegreeInsert) {
  await db.insert(degrees).values(newDegree);

  revalidateDegrees();
}

export async function deleteDegree(id: string) {
  await db.delete(degrees).where(eq(degrees.id, id));

  revalidateDegrees();
}

export async function updateDegree(updatedDegree: Degree) {
  await db
    .update(degrees)
    .set({
      name: updatedDegree.name,
    })
    .where(eq(degrees.id, updatedDegree.id));

  revalidateDegrees();
}

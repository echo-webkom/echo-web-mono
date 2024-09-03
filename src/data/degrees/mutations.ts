import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { degrees, type Degree, type DegreeInsert } from "@/db/schemas";
import { revalidateDegrees } from "./revalidate";

export const createDegree = async (newDegree: DegreeInsert) => {
  await db.insert(degrees).values(newDegree);

  revalidateDegrees();
};

export const deleteDegree = async (id: string) => {
  await db.delete(degrees).where(eq(degrees.id, id));

  revalidateDegrees();
};

export const updateDegree = async (updatedDegree: Degree) => {
  await db
    .update(degrees)
    .set({
      name: updatedDegree.name,
    })
    .where(eq(degrees.id, updatedDegree.id));

  revalidateDegrees();
};

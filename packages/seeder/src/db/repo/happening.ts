import { db } from "@echo-webkom/db";
import { happenings, type HappeningInsert } from "@echo-webkom/db/schemas";

export const create = async (happening: HappeningInsert) => {
  await db.insert(happenings).values(happening).onConflictDoNothing();

  console.log(`Inserted happening ${happening.title} with id ${happening.id}`);
};

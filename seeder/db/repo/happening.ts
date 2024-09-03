import { db } from "@/db/drizzle";
import { happenings, type HappeningInsert } from "@/db/schemas";

export const create = async (happening: HappeningInsert) => {
  await db.insert(happenings).values(happening).onConflictDoNothing();

  console.log(`Inserted happening ${happening.title} with id ${happening.id}`);
};

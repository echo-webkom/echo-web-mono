import { db } from "@echo-webkom/db";
import { happenings, type HappeningInsert } from "@echo-webkom/db/schemas";

export async function create(happening: HappeningInsert) {
  await db.insert(happenings).values(happening).onConflictDoNothing();

  console.log(`Inserted happening ${happening.title} with id ${happening.id}`);
}

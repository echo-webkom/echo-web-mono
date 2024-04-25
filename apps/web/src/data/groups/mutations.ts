import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { groups, type Group, type GroupInsert } from "@echo-webkom/db/schemas";

import { revalidateGroups } from "./revalidate";

export async function createGroup(newGroup: GroupInsert) {
  await db.insert(groups).values(newGroup);

  revalidateGroups();
}

export async function deleteGroup(id: string) {
  await db.delete(groups).where(eq(groups.id, id));

  revalidateGroups();
}

export async function updateGroup(updatedGroup: Group) {
  await db
    .update(groups)
    .set({
      name: updatedGroup.name,
    })
    .where(eq(groups.id, updatedGroup.id));

  revalidateGroups();
}

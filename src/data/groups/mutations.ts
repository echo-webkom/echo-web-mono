import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { groups, type Group, type GroupInsert } from "@/db/schemas";
import { revalidateGroups } from "./revalidate";

export const createGroup = async (newGroup: GroupInsert) => {
  await db.insert(groups).values(newGroup);

  revalidateGroups();
};

export const deleteGroup = async (id: string) => {
  await db.delete(groups).where(eq(groups.id, id));

  revalidateGroups();
};

export const updateGroup = async (updatedGroup: Group) => {
  await db
    .update(groups)
    .set({
      name: updatedGroup.name,
    })
    .where(eq(groups.id, updatedGroup.id));

  revalidateGroups();
};

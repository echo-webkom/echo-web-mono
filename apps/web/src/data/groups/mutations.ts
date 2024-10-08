import { eq } from "drizzle-orm";

import { groups, type Group, type GroupInsert } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

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

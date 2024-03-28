"use server";

import { insertGroupSchema } from "@echo-webkom/db/schemas";

import { createGroup } from "@/data/groups/mutations";
import { webkomAction } from "@/lib/safe-actions";

export const addGroup = webkomAction.input(insertGroupSchema).create(async ({ input }) => {
  await createGroup(input);

  return "Gruppen ble opprettet!";
});

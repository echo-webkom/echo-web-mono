"use server";

import { insertGroupSchema } from "@echo-webkom/db/schemas";

import { createGroup } from "@/data/groups/mutations";
import { groupActionClient } from "@/lib/safe-action";

export const addGroupAction = groupActionClient(["webkom", "hovedstyret"])
  .metadata({ actionName: "addGroup" })
  .schema(insertGroupSchema)
  .action(async ({ parsedInput }) => {
    await createGroup(parsedInput);

    return {
      success: true,
      message: "Gruppen ble opprettet!",
    };
  });

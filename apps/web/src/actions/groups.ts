"use server";

import { z } from "zod";

import { insertGroupSchema, type GroupInsert } from "@echo-webkom/db/schemas";

import { createGroup } from "@/data/groups/mutations";
import { checkAuthorization, handleActionError } from "@/utils/server-action-helpers";

export const addGroup = async (group: GroupInsert) => {
  const authError = await checkAuthorization({ requiredGroups: ["webkom", "hovedstyret"] });
  if (authError) return authError;

  try {
    const data = insertGroupSchema.parse(group);

    await createGroup(data);

    return {
      success: true,
      message: "Gruppen ble opprettet!",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Gruppen er ikke i riktig format",
      };
    }

    return {
      success: false,
      message: "En feil har oppstått",
    };
  }
};

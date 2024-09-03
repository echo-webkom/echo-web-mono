"use server";

import { z } from "zod";

import { createGroup } from "@/data/groups/mutations";
import { GroupInsert, insertGroupSchema } from "@/db/schemas";
import { getUser } from "@/lib/get-user";
import { isMemberOf } from "@/lib/memberships";

export const addGroup = async (group: GroupInsert) => {
  const user = await getUser();

  if (!user) {
    return {
      success: false,
      message: "Du er ikke logget inn",
    };
  }

  if (!isMemberOf(user, ["webkom", "hovedstyret"])) {
    return {
      success: false,
      message: "Du har ikke tilgang til denne funksjonen",
    };
  }

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

"use server";

import { z } from "zod";

import { insertGroupSchema, type GroupInsert } from "@echo-webkom/db/schemas";

import { createGroup } from "@/data/groups/mutations";

export async function addGroup(group: GroupInsert) {
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
}

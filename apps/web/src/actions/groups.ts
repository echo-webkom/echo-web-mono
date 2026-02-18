"use server";

import { z } from "zod";

import { insertGroupSchema, type GroupInsert } from "@echo-webkom/db/schemas";

import { auth } from "@/auth/session";
import { isMemberOf } from "@/lib/memberships";
import { unoWithAdmin } from "../api/server";

export const addGroup = async (group: GroupInsert) => {
  const user = await auth();

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

    await unoWithAdmin.groups.create({
      id: data.id ?? null,
      name: data.name,
    });

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

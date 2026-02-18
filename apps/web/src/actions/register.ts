"use server";

import { type z } from "zod";

import { unoWithAdmin } from "@/api/server";
import { auth } from "@/auth/session";
import { type registrationFormSchema } from "@/lib/schemas/registration";

export const register = async (id: string, payload: z.infer<typeof registrationFormSchema>) => {
  const user = await auth();

  if (!user) {
    console.error("User not found", {
      happeningId: id,
    });
    return {
      success: false,
      message: "Du er ikke logget inn",
    };
  }

  const happeningId = id;
  const userId = user.id;
  const questions = payload.questions;

  try {
    const resp = await unoWithAdmin.happenings.register(happeningId, userId, questions);
    return resp;
  } catch {
    console.error("Failed to register");

    return {
      success: false,
      message: "Noe gikk galt på serveren. Kontakt en i Webkom.",
    };
  }
};

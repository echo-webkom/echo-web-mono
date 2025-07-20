"use server";

import { type z } from "zod";

import { apiServer } from "@/api/server";
import { getUser } from "@/lib/get-user";
import { type registrationFormSchema } from "@/lib/schemas/registration";

export const register = async (id: string, payload: z.infer<typeof registrationFormSchema>) => {
  const user = await getUser();

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
    const resp = await apiServer
      .post("admin/register", {
        json: {
          happeningId,
          userId,
          questions,
        },
      })
      .json<{ success: boolean; message: string }>();

    return resp;
  } catch {
    console.error("Failed to register");

    return {
      success: false,
      message: "Noe gikk galt på serveren. Kontakt en i Webkom.",
    };
  }
};

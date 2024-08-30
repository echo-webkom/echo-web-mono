"use server";

import { type z } from "zod";

import { pingBoomtown } from "@/api/boomtown";
import { revalidateRegistrations } from "@/data/registrations/revalidate";
import { getUser } from "@/lib/get-user";
import { type registrationFormSchema } from "@/lib/schemas/registration";

const url = process.env.NEXT_PUBLIC_ARS_URL;

export const register = async (
  happeningId: string,
  payload: z.infer<typeof registrationFormSchema>,
) => {
  const userId = await getUser().then((user) => user?.id);

  if (!userId) {
    return {
      success: false,
      message: "Du er ikke logget inn",
    };
  }

  if (!url) {
    return {
      success: false,
      message: "Kunne ikke koble til ARS",
    };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ADMIN_KEY}`,
    },
    body: JSON.stringify({
      userId,
      happeningId,
      questions: payload.questions,
    }),
  });

  if (!response.ok) {
    return {
      success: false,
      message: "Noe gikk galt",
    };
  }

  revalidateRegistrations(happeningId, userId);

  void (async () => {
    await pingBoomtown(happeningId);
  })();

  return (await response.json()) as {
    success: boolean;
    message: string;
  };
};

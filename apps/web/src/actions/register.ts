"use server";

import { type z } from "zod";

import { pingBoomtown } from "@/api/boomtown";
import { revalidateRegistrations } from "@/data/registrations/revalidate";
import { getUser } from "@/lib/get-user";
import { type registrationFormSchema } from "@/lib/schemas/registration";

const ARS_URL = process.env.NEXT_PUBLIC_ARS_URL;

const registerUser = async ({
  userId,
  happeningId,
  questions,
}: {
  userId: string;
  happeningId: string;
  questions: Array<{
    questionId: string;
    answer?: string | Array<string>;
  }>;
}): Promise<{
  success: boolean;
  message: string;
}> => {
  if (!ARS_URL) {
    return {
      success: false,
      message: "Ikke koblet til ARS",
    };
  }

  const response = await fetch(ARS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      happeningId,
      questions,
    }),
  });

  if (!response.ok) {
    return {
      success: false,
      message: "Noe gikk galt",
    };
  }

  return (await response.json()) as {
    success: boolean;
    message: string;
  };
};

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

  const json = await registerUser({
    userId,
    happeningId,
    questions: payload.questions,
  });

  revalidateRegistrations(happeningId, userId);

  void (async () => {
    await pingBoomtown(happeningId);
  })();

  return json;
};

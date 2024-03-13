"use server";

import { revalidatePath } from "next/cache";
import { type z } from "zod";

import { auth } from "@echo-webkom/auth";

import { createSubjectReview } from "@/data/fag-vurdering/mutations";
import { reviewForm } from "@/lib/schemas/review";

type Result =
  | {
      result: "success";
    }
  | {
      result: "error";
      message: string;
    };

export async function submitForm(payload: z.infer<typeof reviewForm>) {
  const user = await auth();
  const data = await reviewForm.parseAsync(payload);
  if (!user) {
    return {
      success: false,
      message: "Du er ikke logget inn",
    };
  }

  try {
    await createSubjectReview(data);
  } catch (error) {
    // Unknown error
    console.error(error);

    return {
      result: "error",
      message: "En ukjent feil oppstod",
    };
  }

  revalidatePath(`/for-studenter/fagvurdering/review`);

  return {
    result: "success",
  };
}

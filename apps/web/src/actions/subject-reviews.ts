"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "next-auth/react";
import { z } from "zod";

import { db } from "@echo-webkom/db";
import { subjectReviews } from "@echo-webkom/db/schemas/subject-reviews";

import { reviewForm } from "@/lib/schemas/review";

type Result =
  | {
      result: "success";
    }
  | {
      result: "error";
      message: string;
    };

export const submitForm = async (data: z.infer<typeof reviewForm>): Promise<Result> => {
  const parsedForm = reviewForm.safeParse(data);

  if (!parsedForm.success) {
    return {
      result: "error",
      message: "Ugyldig data",
    };
  }

  const session = await getSession();

  if (!session) {
    return {
      result: "error",
      message: "Du må logge inn for å søke",
    };
  }

  try {
    await db.insert(subjectReviews).values({
      ...parsedForm.data,
      userId: session.user.id,
    });
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
};

"use server";

import { type z } from "zod";

import { auth } from "@echo-webkom/auth";

import { createSubjectReview } from "@/data/fag-vurdering/mutations";
import { reviewForm } from "@/lib/schemas/review";

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
    await createSubjectReview({
      subjectCode: data.subjectCode,
      userId: data.userId,
      difficulty: data.difficulty,
      enjoyment: data.enjoyment,
      usefullness: data.usefullness,
    });

    return {
      success: true,
      message: "Din review ble lagt til.",
    };
  } catch (error) {
    // Unknown error
    console.error(error);

    return {
      success: false,
      message: "Det oppstod en feil",
    };
  }
}

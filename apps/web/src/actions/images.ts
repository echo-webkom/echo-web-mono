"use server";

import { z } from "zod";

import { echoGram } from "@/api/echogram";
import { authedAction } from "@/lib/safe-actions";

export const uploadImage = authedAction
  .input(
    z.object({
      userId: z.string(),
      file: z.instanceof(File),
    }),
  )
  .create(async ({ input, ctx }) => {
    if (ctx.user.id !== input.userId) {
      throw new Error("Du kan ikke laste opp bilder for andre brukere");
    }

    return await echoGram.uploadImage(input.userId, input.file);
  });

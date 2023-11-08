"use server";

import { z } from "zod";

import { getAuth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";
import { shoppingListItems } from "@echo-webkom/db/schemas";

const shoppingListSchema = z.object({
  name: z.string(),
});

export async function hyggkomSubmit(payload: z.infer<typeof shoppingListSchema>) {
  try {
    const user = await getAuth();

    const data = await shoppingListSchema.parseAsync(payload);

    if (!user) {
      return {
        success: false,
        message: "Du er ikke logget inn",
      };
    }
    await db.insert(shoppingListItems).values([
      {
        userId: user.id,
        name: data.name,
      },
    ]);
    return {
      success: true,
      message: "Ditt forslag er lagt til.",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Skjemaet er ikke i riktig format",
      };
    }
    return {
      success: false,
      message: "Noe gikk galt",
    };
  }
}

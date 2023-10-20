"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { getAuthSession } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";
import { insertUserSchema, users } from "@echo-webkom/db/schemas";

const updateSelfPayloadSchema = insertUserSchema.pick({
  alternativeEmail: true,
  degreeId: true,
  year: true,
});

export async function updateSelf(payload: z.infer<typeof updateSelfPayloadSchema>) {
  try {
    const session = await getAuthSession();

    if (!session) {
      return {
        success: false,
        message: "Du er ikke logget inn",
      };
    }

    const data = await updateSelfPayloadSchema.parseAsync(payload);

    const user = await db
      .update(users)
      .set({
        alternativeEmail: data.alternativeEmail ?? null,
        degreeId: data.degreeId,
        year: data.year,
      })
      .where(eq(users.id, session.user.id))
      .returning()
      .then((res) => res[0] ?? null);

    if (!user) {
      return {
        success: false,
        message: "Fikk ikke til å oppdatere brukeren",
      };
    }

    return {
      success: true,
      message: "Brukeren ble oppdatert",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Tilbakemeldingen er ikke i riktig format",
      };
    }

    return {
      success: false,
      message: "En feil har oppstått",
    };
  }
}

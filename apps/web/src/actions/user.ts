"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { insertUserSchema, users, usersToGroups } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

import { getUser } from "@/lib/get-user";
import { isWebkom } from "@/lib/memberships";

const updateSelfPayloadSchema = insertUserSchema.pick({
  alternativeEmail: true,
  degreeId: true,
  year: true,
  hasReadTerms: true,
  birthday: true,
});

export const updateSelf = async (payload: z.infer<typeof updateSelfPayloadSchema>) => {
  try {
    const user = await getUser();

    if (!user) {
      return {
        success: false,
        message: "Du er ikke logget inn",
      };
    }

    const data = updateSelfPayloadSchema.parse(payload);

    const resp = await db
      .update(users)
      .set({
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        alternativeEmail: data.alternativeEmail?.trim() || null,
        degreeId: data.degreeId,
        year: data.year,
        hasReadTerms: data.hasReadTerms,
        birthday: data.birthday,
      })
      .where(eq(users.id, user.id))
      .returning()
      .then((res) => res[0] ?? null);

    if (!resp) {
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
};

const updateUserPayloadSchema = z.object({
  memberships: z.array(z.string()),
});

export const updateUser = async (
  userId: string,
  payload: z.infer<typeof updateUserPayloadSchema>,
) => {
  try {
    const user = await getUser();

    if (user === null || !isWebkom(user)) {
      return {
        success: false,
        message: "Du er ikke logget inn som en admin",
      };
    }

    const data = await updateUserPayloadSchema.parseAsync(payload);

    await db.delete(usersToGroups).where(eq(usersToGroups.userId, userId));
    if (data.memberships.length > 0) {
      await db
        .insert(usersToGroups)
        .values(data.memberships.map((groupId) => ({ userId, groupId })));
    }

    return {
      success: true,
      message: "Bruker oppdatert",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Tilbakemeldingen er ikke i riktig format",
      };
    }

    return {
      result: "error",
      message: "Something went wrong",
    };
  }
};

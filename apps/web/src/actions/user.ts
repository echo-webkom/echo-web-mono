"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { getAuth, getAuthSession } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";
import { insertUserSchema, users, usersToGroups, userTypeEnum } from "@echo-webkom/db/schemas";

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

const updateUserPayloadSchema = z.object({
  type: z.enum(userTypeEnum.enumValues),
  memberships: z.array(z.string()),
});

export const updateUser = async (
  userId: string,
  payload: z.infer<typeof updateUserPayloadSchema>,
) => {
  try {
    const user = await getAuth();

    if (user === null || user.type !== "admin") {
      return {
        success: false,
        message: "Du er ikke logget inn som en admin",
      };
    }

    const data = await updateUserPayloadSchema.parseAsync(payload);

    await db.delete(usersToGroups).where(eq(usersToGroups.userId, userId));
    await db.insert(usersToGroups).values(data.memberships.map((groupId) => ({ userId, groupId })));
    await db.update(users).set({ type: data.type }).where(eq(users.id, userId));

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

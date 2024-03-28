"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@echo-webkom/db";
import { insertUserSchema, users, usersToGroups } from "@echo-webkom/db/schemas";

import { authedAction, webkomAction } from "@/lib/safe-actions";

const updateSelfPayloadSchema = insertUserSchema.pick({
  alternativeEmail: true,
  degreeId: true,
  year: true,
});

export const updateSelf = authedAction
  .input(updateSelfPayloadSchema)
  .create(async ({ input, ctx }) => {
    const response = await db
      .update(users)
      .set({
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        alternativeEmail: input.alternativeEmail?.trim() || null,
        degreeId: input.degreeId,
        year: input.year,
      })
      .where(eq(users.id, ctx.user.id))
      .returning()
      .then((res) => res[0] ?? null);

    if (!response) {
      throw new Error("Fikk ikke til å oppdatere brukeren");
    }

    return "Brukeren ble oppdatert";
  });

export const updateUser = webkomAction
  .input(
    z.object({
      userId: z.string(),
      memberships: z.array(z.string()),
    }),
  )
  .create(async ({ input }) => {
    await db.delete(usersToGroups).where(eq(usersToGroups.userId, input.userId));

    if (input.memberships.length > 0) {
      await db
        .insert(usersToGroups)
        .values(input.memberships.map((groupId) => ({ userId: input.userId, groupId })));
    }

    return "Bruker oppdatert";
  });

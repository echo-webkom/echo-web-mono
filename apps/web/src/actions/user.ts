"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@echo-webkom/db";
import { insertUserSchema, users, usersToGroups } from "@echo-webkom/db/schemas";

import { authActionClient, groupActionClient } from "@/lib/safe-action";

const updateSelfPayloadSchema = insertUserSchema.pick({
  alternativeEmail: true,
  degreeId: true,
  year: true,
});

export const updateSelfAction = authActionClient
  .metadata({ actionName: "updateSelf" })
  .schema(updateSelfPayloadSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx;

    const resp = await db
      .update(users)
      .set({
        ...parsedInput,
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
  });

const updateUserPayloadSchema = z.object({
  userId: z.string(),
  memberships: z.array(z.string()),
});

export const updateUserAction = groupActionClient(["webkomk"])
  .metadata({ actionName: "updateUser" })
  .schema(updateUserPayloadSchema)
  .action(async ({ parsedInput }) => {
    const { userId, memberships } = parsedInput;

    await db.delete(usersToGroups).where(eq(usersToGroups.userId, userId));
    if (memberships.length > 0) {
      await db.insert(usersToGroups).values(memberships.map((groupId) => ({ userId, groupId })));
    }

    return {
      success: true,
      message: "Bruker oppdatert",
    };
  });

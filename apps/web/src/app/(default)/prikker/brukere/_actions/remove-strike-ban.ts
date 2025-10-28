"use server";

import { and, eq } from "drizzle-orm";

import { banInfos, dots } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

import { auth } from "@/auth/session";
import { checkAuthorization } from "@/utils/server-action-helpers";

export const removeBanAction = async (userId: string) => {
  const authError = await checkAuthorization({ requiredGroups: ["bedkom", "webkom"] });
  if (authError) return authError;

  const user = await auth();
  await db.delete(banInfos).where(eq(banInfos.userId, userId));

  console.info(`User, ${user!.id}, removed ban for user, ${userId}`);

  return {
    success: true,
    message: "Brukeren er ikke lenger bannet",
  };
};

export const removeStrikeAction = async (userId: string, strikeId: number) => {
  const authError = await checkAuthorization({ requiredGroups: ["bedkom", "webkom"] });
  if (authError) return authError;

  const user = await auth();
  await db.delete(dots).where(and(eq(dots.userId, userId), eq(dots.id, strikeId)));

  console.info(`User, ${user!.id}, removed strike, ${strikeId}, for user, ${userId}`);

  return {
    success: true,
    message: "Fjernet prikk på bruker",
  };
};

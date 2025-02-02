"use server";

import { eq } from "drizzle-orm";

import { users } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

export const unbanUser = async (userId: string) => {
  const user = await db
    .update(users)
    .set({ isBanned: false })
    .where(eq(users.id, userId))
    .returning({ id: users.id })
    .then((res) => res[0] ?? null);

  if (!user) {
    return {
      success: false,
      message: "Fikk ikke fjernet utestengelsen",
    };
  }

  return {
    success: true,
    message: "Brukeren er ikke lenger utestengt",
  };
};

"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { users } from "@/db/schemas";

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

"use server";

import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { users } from "@echo-webkom/db/schemas";

export async function unbanUser(userId: string) {
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
}

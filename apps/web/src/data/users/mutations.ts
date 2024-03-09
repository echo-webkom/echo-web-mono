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
    throw new Error("Failed to unban user");
  }
}

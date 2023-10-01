import { eq } from "drizzle-orm";

import { db } from "../drizzle";

export const getUserByEmail = async (email: string) => {
  return (
    (await db.query.users.findFirst({
      where: (u) => eq(u.email, email),
    })) ?? null
  );
};

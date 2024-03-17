import { db } from "@echo-webkom/db";
import { accounts, sessions, users, type UserType } from "@echo-webkom/db/schemas";

export async function create({
  id,
  name,
  email,
  type,
  token,
  year = 1,
  degreeId = "dtek",
}: {
  id: string;
  name: string;
  email: string;
  type: UserType;
  token: string;
  year?: number;
  degreeId?: string;
}) {
  console.log(`Inserted user ${name} with id ${id}`);
  await db
    .insert(users)
    .values({
      id,
      name,
      email,
      type,
      year,
      degreeId,
    })
    .onConflictDoNothing();

  await db
    .insert(accounts)
    .values({
      userId: id,
      type: "oauth",
      provider: "test",
      providerAccountId: token,
    })
    .onConflictDoNothing();

  await db
    .insert(sessions)
    .values({
      sessionToken: token,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      userId: id,
    })
    .onConflictDoNothing();
}

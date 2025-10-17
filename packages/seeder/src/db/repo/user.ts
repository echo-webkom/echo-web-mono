import { accounts, sessions, users, type UserType } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

export const create = async ({
  id,
  name,
  email,
  type,
  token,
  year = 1,
  degreeId = "dtek",
  hasReadTerms = true,
  isPublic = false,
}: {
  id: string;
  name: string;
  email: string;
  type: UserType;
  token: string;
  year?: number;
  degreeId?: string;
  hasReadTerms?: boolean;
  isPublic?: boolean;
}) => {
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
      hasReadTerms,
      isPublic,
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
};

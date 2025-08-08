"use server";

import { eq } from "drizzle-orm";

import { accessRequests } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

import { auth } from "@/auth/session";
import { isMemberOf } from "@/lib/memberships";

export const deleteAccessRequestAction = async (accessRequestId: string) => {
  const user = await auth();

  if (!user || !isMemberOf(user, ["webkom", "hovedstyret"])) {
    throw new Error("Du har ikke tilgang til å slette forespørsler");
  }

  await db.delete(accessRequests).where(eq(accessRequests.id, accessRequestId));

  return {
    success: true,
    message: "Forespørsel slettet",
  };
};

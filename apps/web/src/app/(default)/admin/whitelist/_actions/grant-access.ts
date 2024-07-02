"use server";

import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { accessRequests, whitelist } from "@echo-webkom/db/schemas";

import { getUser } from "@/lib/get-user";
import { isMemberOf } from "@/lib/memberships";

export const grantAccessAction = async (accessRequestId: string) => {
  const user = await getUser();

  if (!user || !isMemberOf(user, ["webkom", "hovedstyret"])) {
    throw new Error("Du har ikke tilgang til å slette forespørsler");
  }

  const accessRequest = await db.query.accessRequests.findFirst({
    where: eq(accessRequests.id, accessRequestId),
  });

  if (!accessRequest) {
    throw new Error("Forespørsel ikke funnet");
  }

  const ONE_YEAR = new Date(1000 * 60 * 60 * 24 * 365 + Date.now());

  await db.insert(whitelist).values({
    email: accessRequest.email,
    expiresAt: ONE_YEAR,
    reason: `Tilgang etter forespørsel: ${accessRequest.reason}`,
  });

  await db.delete(accessRequests).where(eq(accessRequests.id, accessRequestId));

  return {
    success: true,
    message: "Forespørsel slettet",
  };
};

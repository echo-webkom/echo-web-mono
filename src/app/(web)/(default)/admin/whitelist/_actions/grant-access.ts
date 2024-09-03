"use server";

import { eq } from "drizzle-orm";

import AccessGrantedEmail from "@/components/emails/access-granted";
import { db } from "@/db/drizzle";
import { isPostgresIshError } from "@/db/errors";
import { accessRequests, whitelist } from "@/db/schemas";
import { emailClient } from "@/lib/email/client";
import { getUser } from "@/lib/get-user";
import { isMemberOf } from "@/lib/memberships";

export const grantAccessAction = async (accessRequestId: string) => {
  const user = await getUser();

  if (!user || !isMemberOf(user, ["webkom", "hovedstyret"])) {
    return {
      success: false,
      message: "Du har ikke tilgang til denne handlingen",
    };
  }

  const accessRequest = await db.query.accessRequests.findFirst({
    where: eq(accessRequests.id, accessRequestId),
  });

  if (!accessRequest) {
    return {
      success: false,
      message: "Forespørsel ikke funnet",
    };
  }

  const ONE_YEAR = new Date(1000 * 60 * 60 * 24 * 365 + Date.now());

  try {
    await db.insert(whitelist).values({
      email: accessRequest.email,
      expiresAt: ONE_YEAR,
      reason: `Tilgang etter forespørsel: ${accessRequest.reason}`,
    });

    await db.delete(accessRequests).where(eq(accessRequests.id, accessRequestId));
  } catch (e) {
    if (isPostgresIshError(e)) {
      if (e.code === "23505") {
        return {
          success: false,
          message: "E-posten er allerede i whitelist",
        };
      }
    }
    return {
      success: false,
      message: "Kunne ikke legge til i whitelist",
    };
  }

  await emailClient.sendEmail(
    [accessRequest.email],
    "Tilgang til echo.uib.no",
    AccessGrantedEmail(),
  );

  return {
    success: true,
    message: "Forespørsel slettet",
  };
};

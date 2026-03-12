"use server";

import { eq } from "drizzle-orm";

import { isPostgresIshError } from "@echo-webkom/db/error";
import { accessRequests, whitelist } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";
import { AccessGrantedEmail } from "@echo-webkom/email";
import { emailClient } from "@echo-webkom/email/client";

import { auth } from "@/auth/session";
import { isMemberOf } from "@/lib/memberships";

function getNextSemesterStart() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  if (month >= 7) {
    return new Date(year + 1, 0, 1); // January 1st of next year
  }
  return new Date(year, 7, 1); // August 1st of current year
}

export const grantAccessAction = async (accessRequestId: string) => {
  const user = await auth();

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

  const expiresAt = getNextSemesterStart();

  try {
    await db.insert(whitelist).values({
      email: accessRequest.email,
      expiresAt,
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

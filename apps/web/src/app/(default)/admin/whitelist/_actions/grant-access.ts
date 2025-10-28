"use server";

import { eq } from "drizzle-orm";

import { isPostgresIshError } from "@echo-webkom/db/error";
import { accessRequests, whitelist } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";
import { AccessGrantedEmail } from "@echo-webkom/email";
import { emailClient } from "@echo-webkom/email/client";

import { checkAuthorization } from "@/utils/server-action-helpers";

export const grantAccessAction = async (accessRequestId: string) => {
  const authError = await checkAuthorization({ requiredGroups: ["webkom", "hovedstyret"] });
  if (authError) return authError;

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

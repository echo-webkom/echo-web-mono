"use server";

import { eq } from "drizzle-orm";

import { accessRequests } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";
import { AccessDeniedEmail } from "@echo-webkom/email";
import { emailClient } from "@echo-webkom/email/client";

import { checkAuthorization } from "@/utils/server-action-helpers";

export const deleteAccessRequestAction = async (accessRequestId: string, reason: string) => {
  const authError = await checkAuthorization({ requiredGroups: ["webkom", "hovedstyret"] });
  if (authError) {
    throw new Error("Du har ikke tilgang til å slette forespørsler");
  }

  const accessRequest = await db.query.accessRequests.findFirst({
    where: eq(accessRequests.id, accessRequestId),
  });

  if (!accessRequest) {
    throw new Error("Forespørsel ikke funnet");
  }

  await db.delete(accessRequests).where(eq(accessRequests.id, accessRequestId));

  await emailClient.sendEmail(
    [accessRequest.email],
    "Tilgang til echo.uib.no avslått",
    AccessDeniedEmail({ reason }),
  );

  return {
    success: true,
    message: "Forespørsel slettet",
  };
};

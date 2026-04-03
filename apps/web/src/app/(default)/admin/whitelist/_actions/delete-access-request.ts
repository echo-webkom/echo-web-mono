"use server";

import { AccessDeniedEmail } from "@echo-webkom/email";
import { emailClient } from "@echo-webkom/email/client";

import { unoWithAdmin } from "@/api/server";
import { auth } from "@/auth/session";
import { isMemberOf } from "@/lib/memberships";

export const deleteAccessRequestAction = async (accessRequestId: string, reason: string) => {
  const user = await auth();

  if (!user || !isMemberOf(user, ["webkom", "hovedstyret"])) {
    throw new Error("Du har ikke tilgang til å slette forespørsler");
  }

  const requests = await unoWithAdmin.accessRequests.all();
  const accessRequest = requests.find((row) => row.id === accessRequestId);

  if (!accessRequest) {
    throw new Error("Forespørsel ikke funnet");
  }

  await unoWithAdmin.accessRequests.remove(accessRequestId);

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

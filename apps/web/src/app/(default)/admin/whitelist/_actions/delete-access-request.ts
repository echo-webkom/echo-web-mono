"use server";

import { unoWithAdmin } from "@/api/server";
import { auth } from "@/auth/session";
import { isMemberOf } from "@/lib/memberships";

export const deleteAccessRequestAction = async (accessRequestId: string, reason: string) => {
  const user = await auth();

  if (!user || !isMemberOf(user, ["webkom", "hovedstyret"])) {
    throw new Error("Du har ikke tilgang til å slette forespørsler");
  }

  await unoWithAdmin.accessRequests.deny(accessRequestId, reason);

  return {
    success: true,
    message: "Forespørsel avslått",
  };
};

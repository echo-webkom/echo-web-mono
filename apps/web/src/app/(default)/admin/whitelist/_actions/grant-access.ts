"use server";

import { unoWithAdmin } from "@/api/server";
import { auth } from "@/auth/session";
import { isMemberOf } from "@/lib/memberships";

export const grantAccessAction = async (accessRequestId: string) => {
  const user = await auth();

  if (!user || !isMemberOf(user, ["webkom", "hovedstyret"])) {
    return {
      success: false,
      message: "Du har ikke tilgang til denne handlingen",
    };
  }

  const ok = await unoWithAdmin.accessRequests.approve(accessRequestId);

  if (!ok) {
    return {
      success: false,
      message: "Kunne ikke godkjenne forespørselen",
    };
  }

  return {
    success: true,
    message: "Forespørsel godkjent",
  };
};

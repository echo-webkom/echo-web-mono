import { z } from "zod";

import { type Group } from "@echo-webkom/lib";

import { auth } from "@/auth/session";
import { isMemberOf, type TUser } from "@/lib/memberships";

type ActionResult = {
  success: boolean;
  message: string;
};

type AuthorizationOptions = {
  requireAuth?: boolean;
  requiredGroups?: Array<Group>;
  customCheck?: (user: TUser) => boolean;
};

/**
 * Wrapper for server actions that handles authentication and authorization
 * Returns null if authorized, or an error result if not authorized
 */
export async function checkAuthorization(
  options: AuthorizationOptions = {},
): Promise<ActionResult | null> {
  const { requireAuth = true, requiredGroups, customCheck } = options;

  if (!requireAuth) {
    return null;
  }

  const user = await auth();

  if (!user) {
    return {
      success: false,
      message: "Du er ikke logget inn",
    };
  }

  if (requiredGroups && !isMemberOf(user, requiredGroups)) {
    return {
      success: false,
      message: "Du har ikke tilgang til denne funksjonen",
    };
  }

  if (customCheck && !customCheck(user)) {
    return {
      success: false,
      message: "Du har ikke tilgang til denne funksjonen",
    };
  }

  return null;
}

/**
 * Handles common error patterns in server actions
 */
export function handleActionError(error: unknown, context?: string): ActionResult {
  if (context) {
    console.error(`[${context}] Error: ${error}`);
  }

  if (error instanceof z.ZodError) {
    return {
      success: false,
      message: "Feil i skjemaet",
    };
  }

  return {
    success: false,
    message: "En ukjent feil oppstod",
  };
}

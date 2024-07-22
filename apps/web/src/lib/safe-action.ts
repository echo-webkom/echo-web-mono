import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

import type { Group } from "@echo-webkom/lib";

import { getUser } from "./get-user";
import { isMemberOf } from "./memberships";

export const actionClient = createSafeActionClient({
  defineMetadataSchema: () => {
    return z.object({
      actionName: z.string(),
    });
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const user = await getUser();

  if (!user) {
    throw new Error("Session not found");
  }

  return next({ ctx: { user } });
});

export const groupActionClient = (groups: Array<Group>) => {
  return authActionClient.use(async ({ next, ctx }) => {
    if (!isMemberOf(ctx.user, groups)) {
      throw new Error("User not in group");
    }

    return next({ ctx });
  });
};

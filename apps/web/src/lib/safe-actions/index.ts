import { auth } from "@echo-webkom/auth";

import { isMemberOf } from "../memberships";
import { createAction } from "./action-builder";

export const publicAction = createAction();

export const authedAction = createAction({
  ctx: async () => {
    const user = await auth();

    if (!user) {
      throw new Error("Du er ikke logget inn.");
    }

    return {
      user,
    };
  },
});

export const webkomAction = createAction({
  ctx: async () => {
    const user = await auth();

    if (!user) {
      throw new Error("Du er ikke logget inn.");
    }

    if (!isMemberOf(user, ["webkom"])) {
      throw new Error("Du er ikke med i Webkom");
    }

    return {
      user,
    };
  },
});

export const bedkomAction = createAction({
  ctx: async () => {
    const user = await auth();

    if (!user) {
      throw new Error("Du er ikke logget inn.");
    }

    if (!isMemberOf(user, ["bedkom"])) {
      throw new Error("Du er ikke med i Bedkom");
    }

    return {
      user,
    };
  },
});

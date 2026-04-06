"use server";

import { unoWithAdmin } from "@/api/server";
import { auth } from "@/auth/session";
import { isMemberOf } from "@/lib/memberships";

export const removeBanAction = async (userId: string) => {
  const user = await auth();

  if (!user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!isMemberOf(user, ["bedkom", "webkom"])) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  await unoWithAdmin.users.removeBan(userId);

  console.info(`User, ${user.id}, removed ban for user, ${userId}`);

  return {
    success: true,
    message: "Brukeren er ikke lenger bannet",
  };
};

export const removeStrikeAction = async (userId: string, strikeId: number) => {
  const user = await auth();

  if (!user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!isMemberOf(user, ["bedkom", "webkom"])) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  await unoWithAdmin.users.removeStrike(userId, strikeId);

  console.info(`User, ${user.id}, removed strike, ${strikeId}, for user, ${userId}`);

  return {
    success: true,
    message: "Fjernet prikk på bruker",
  };
};

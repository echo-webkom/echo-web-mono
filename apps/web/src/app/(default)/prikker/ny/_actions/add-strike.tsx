"use server";

import { type z } from "zod";

import { unoWithAdmin } from "@/api/server";
import { auth } from "@/auth/session";
import { isMemberOf } from "@/lib/memberships";

import { parseAddStrikesSchema, type addStrikesSchema } from "../_lib/schema";

export const addStrikesAction = async (input: z.infer<typeof addStrikesSchema>) => {
  try {
    const user = await auth();

    if (!user || !isMemberOf(user, ["bedkom", "webkom"])) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const { success, data } = parseAddStrikesSchema(input);

    if (!success) {
      return {
        success: false,
        message: "Ugyldig input",
      };
    }

    const strikedUser = await unoWithAdmin.users.byId(data.userId).catch(() => null);
    if (!strikedUser) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const result = await unoWithAdmin.users.addStrike(
      {
        count: data.count,
        reason: data.reason,
        strikeExpiresInMonths: data.strikeExpiresInMonths,
        banExpiresInMonths: data.banExpiresInMonths,
        strikedBy: user.id,
      },
      data.userId,
    );

    const shouldBeBanned = result.isBanned;

    const message = shouldBeBanned
      ? `Brukeren er bannet i ${data.banExpiresInMonths} måneder`
      : `Brukeren har fått ${data.count} prikk(er)`;

    return {
      success: true,
      message,
    };
  } catch (e) {
    console.error(e);

    return {
      success: false,
      message: "Ugyldig input",
    };
  }
};

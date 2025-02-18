"use server";

import { addMonths } from "date-fns";
import { eq } from "drizzle-orm";
import { type z } from "zod";

import { banInfos, dots } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

import { getUser } from "@/lib/get-user";
import { isBedkom } from "@/lib/memberships";
import { parseAddStrikesSchema, type addStrikesSchema } from "../_lib/schema";

export const addStrikesAction = async (input: z.infer<typeof addStrikesSchema>) => {
  try {
    const user = await getUser();

    if (!user || !isBedkom(user)) {
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

    const strikedUser = await db.query.users.findFirst({
      where: (row, { eq }) => eq(row.id, data.userId),
      with: {
        dots: true,
        banInfo: true,
      },
    });

    if (!strikedUser) {
      return {
        success: false,
        message: "User not found",
      };
    }

    if (strikedUser.banInfo) {
      return {
        success: false,
        message: "User is banned",
      };
    }

    const previousStrikes = strikedUser.dots.reduce((acc, dot) => acc + dot.count, 0);
    const shouldBeBanned = previousStrikes + data.count >= 5;

    if (shouldBeBanned) {
      await db.insert(banInfos).values({
        userId: data.userId,
        reason: data.reason,
        bannedBy: user.id,
        createdAt: new Date(),
        expiresAt: addMonths(new Date(), data.expiresInMonths),
      });

      await db.delete(dots).where(eq(dots.userId, data.userId));
    } else {
      await db.insert(dots).values({
        count: data.count,
        reason: data.reason,
        userId: data.userId,
        createdAt: new Date(),
        strikedBy: user.id,
        expiresAt: addMonths(new Date(), 10),
      });
    }

    return {
      success: true,
      message: "Strikes added",
    };
  } catch (e) {
    console.error(e);

    return {
      success: false,
      message: "Invalid input",
    };
  }
};

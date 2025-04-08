"use server";

import { addMonths } from "date-fns";
import { eq } from "drizzle-orm";
import { type z } from "zod";

import { banInfos, dots } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";
import { StrikeNotificationEmail } from "@echo-webkom/email";
import { emailClient } from "@echo-webkom/email/client";

import { getUser } from "@/lib/get-user";
import { isMemberOf } from "@/lib/memberships";
import { parseAddStrikesSchema, type addStrikesSchema } from "../_lib/schema";

export const addStrikesAction = async (input: z.infer<typeof addStrikesSchema>) => {
  try {
    const user = await getUser();

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
    const overflowStrikes = previousStrikes + data.count - 5;

    if (shouldBeBanned) {
      await db.insert(banInfos).values({
        userId: data.userId,
        reason: data.reason,
        bannedBy: user.id,
        createdAt: new Date(),
        expiresAt: addMonths(new Date(), data.banExpiresInMonths),
      });

      await db.delete(dots).where(eq(dots.userId, data.userId));

      if (overflowStrikes > 0) {
        await db.insert(dots).values({
          count: overflowStrikes,
          reason: data.reason,
          userId: data.userId,
          createdAt: new Date(),
          strikedBy: user.id,
          expiresAt: addMonths(new Date(), data.strikeExpiresInMonths),
        });
      }
    } else {
      await db.insert(dots).values({
        count: data.count,
        reason: data.reason,
        userId: data.userId,
        createdAt: new Date(),
        strikedBy: user.id,
        expiresAt: addMonths(new Date(), data.strikeExpiresInMonths),
      });
    }

    const sendToEmail = strikedUser.alternativeEmail ?? strikedUser.email;

    await emailClient.sendEmail(
      [sendToEmail],
      "VIKTIG: Du har fått prikk",
      <StrikeNotificationEmail
        amount={data.count}
        isBanned={shouldBeBanned}
        name={strikedUser.name ?? "Ola Nordmann"}
        reason={data.reason}
      />,
    );

    const message = shouldBeBanned
      ? `Brukeren er bannet i ${data.banExpiresInMonths} måneder`
      : `Brukeren har nå ${previousStrikes + data.count} prikker`;

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

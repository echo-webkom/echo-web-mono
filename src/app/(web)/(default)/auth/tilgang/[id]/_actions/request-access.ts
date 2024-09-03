"use server";

import { nanoid } from "nanoid";
import { z } from "zod";

import AccessRequestNotificationEmail from "@/components/emails/access-request-notification";
import { db } from "@/db/drizzle";
import { isPostgresIshError } from "@/db/errors";
import { accessRequests } from "@/db/schemas";
import { emailClient } from "@/lib/email/client";
import { requestAccessSchema, type IRequestAccessForm } from "../_lib/request-access";

type RequestAccessResponse =
  | {
      success: true;
      data: {
        id: string;
      };
    }
  | {
      success: false;
      message: string;
    };

export const requestAccess = async (data: IRequestAccessForm): Promise<RequestAccessResponse> => {
  try {
    const { email, reason } = requestAccessSchema.parse(data);

    const id = nanoid();

    await db.insert(accessRequests).values({
      id,
      email,
      reason,
    });

    await emailClient.sendEmail(
      ["echo@uib.no"],
      `Forespørsel om tilgang til echo.uib.no`,
      AccessRequestNotificationEmail({
        email,
        reason,
      }),
    );

    return {
      success: true,
      data: {
        id,
      },
    };
  } catch (e) {
    console.error(e);

    if (e instanceof z.ZodError) {
      return {
        success: false,
        message: "Du må fylle ut alle feltene",
      };
    }

    if (isPostgresIshError(e)) {
      if (e.code === "23505") {
        return {
          success: false,
          message: "Du har allerede sendt en forespørsel",
        };
      }
    }

    return {
      success: false,
      message: "Noe gikk galt",
    };
  }
};

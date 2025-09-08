"use server";

import { nanoid } from "nanoid";
import { z } from "zod";

import { isPostgresIshError } from "@echo-webkom/db/error";
import { accessRequests } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";
import { AccessRequestNotificationEmail } from "@echo-webkom/email";
import { emailClient } from "@echo-webkom/email/client";

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

    await sendSlackNotification(email, reason);

    await emailClient.sendEmail(
      ["echo@uib.no"],
      "Forespørsel om tilgang til echo.uib.no",
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

const SLACK_ACCESS_REQUEST_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

async function sendSlackNotification(email: string, reason: string) {
  if (!SLACK_ACCESS_REQUEST_WEBHOOK_URL) {
    console.error("SLACK_WEBHOOK_URL is not defined");
    return;
  }

  const message = {
    text: "🔐 Søknad om tilgang",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🔐 Søknad om tilgang",
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*E-post:*\n${email}`,
          },
          {
            type: "mrkdwn",
            text: `*Grunn:*\n${reason}`,
          },
        ],
      },
    ],
  };

  try {
    await fetch(SLACK_ACCESS_REQUEST_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    console.info("Slack notification sent successfully");
  } catch (error) {
    console.error("Error sending Slack notification:", error);
  }
}

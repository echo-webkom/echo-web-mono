import { z } from "zod";

import { db } from "@echo-webkom/db";
import { siteFeedback } from "@echo-webkom/db/schemas";

import { feedbackSchema } from "@/lib/schemas/feedback";

export async function POST(req: Request) {
  try {
    const payload = feedbackSchema.parse(await req.json());

    await db.insert(siteFeedback).values({
      email: payload.email,
      name: payload.name,
      message: payload.message,
    });

    return new Response("Takk for din tilbakemelding!", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 400 });
    }

    return new Response(null, { status: 500 });
  }
}

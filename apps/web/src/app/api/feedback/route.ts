import {z} from "zod";

import {prisma} from "@echo-webkom/db/client";

import {feedbackSchema} from "@/lib/schemas/feedback";

export async function POST(req: Request) {
  try {
    const payload = feedbackSchema.parse(await req.json());

    await prisma.siteFeedback.create({
      data: {
        email: payload.email,
        name: payload.name,
        message: payload.message,
      },
    });

    return new Response("Takk for din tilbakemelding!", {status: 200});
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), {status: 400});
    }

    return new Response(null, {status: 500});
  }
}

import {z} from "zod";

import {prisma} from "@echo-webkom/db/client";

import {feedbackSchema} from "@/lib/schemas/feedback";

export async function POST(req: Request) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await req.json();
    const payload = feedbackSchema.parse(body);

    await prisma.siteFeedback.create({
      data: {
        ...payload,
      },
    });

    return new Response(null, {status: 200});
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), {status: 422});
    }

    return new Response(null, {status: 500});
  }
}

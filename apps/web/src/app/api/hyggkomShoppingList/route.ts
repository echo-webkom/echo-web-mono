import { z } from "zod";

import { prisma } from "@echo-webkom/db";

import { hyggkomListSchema } from "@/lib/schemas/hyggkomShoppingList";

export async function POST(req: Request) {
  try {
    const payload = hyggkomListSchema.parse(await req.json());

    await prisma.siteFeedback.create({
      data: {
        message: payload.message,
      },
    });

    return new Response("Takk for forslaget!", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 400 });
    }

    return new Response(null, { status: 500 });
  }
}

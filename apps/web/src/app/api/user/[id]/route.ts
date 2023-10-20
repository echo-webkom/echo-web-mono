import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@echo-webkom/db";
import { users } from "@echo-webkom/db/schemas";

import { getUser } from "@/lib/session";

const routeContextSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

const payloadSchema = z.object({
  alternativeEmail: z.string().email().or(z.literal("")).optional(),
  degree: z.string().optional(),
  year: z.number().min(1).max(5).optional(),
});

export async function PATCH(req: Request, context: z.infer<typeof routeContextSchema>) {
  try {
    const { params } = routeContextSchema.parse(context);

    const user = await getUser();
    if (!user || params.id !== user.id) {
      return new Response(null, { status: 403 });
    }

    const payload = payloadSchema.parse(await req.json());

    await db
      .update(users)
      .set({
        alternativeEmail: payload.alternativeEmail ?? null,
        degreeId: payload.degree,
        year: payload.year,
      })
      .where(eq(users.id, user.id));

    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 400 });
    }

    return new Response(null, { status: 500 });
  }
}

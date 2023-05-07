import {z} from "zod";

import {prisma} from "@echo-webkom/db/client";
import {Degree} from "@echo-webkom/db/types";

import {getServerSession} from "@/lib/session";

const routeContextSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

const payloadSchema = z.object({
  alternativeEmail: z.string().email().or(z.literal("")).optional(),
  degree: z.nativeEnum(Degree).optional(),
  year: z.number().min(1).max(5).optional(),
});

export async function PATCH(req: Request, context: z.infer<typeof routeContextSchema>) {
  try {
    const {params} = routeContextSchema.parse(context);

    const session = await getServerSession();
    if (!session?.user || params.id !== session?.user.id) {
      return new Response(null, {status: 403});
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await req.json();
    const payload = payloadSchema.parse(body);

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        alternativeEmail: payload.alternativeEmail ?? null,
        degree: payload.degree,
        year: payload.year,
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

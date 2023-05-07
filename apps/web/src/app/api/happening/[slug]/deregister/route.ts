import {z} from "zod";

import {prisma} from "@echo-webkom/db/client";

import {getServerSession} from "@/lib/session";

const routeContextSchema = z.object({
  params: z.object({
    slug: z.string(),
  }),
});

const payloadSchema = z.object({
  reason: z.string(),
});

export async function POST(req: Request, context: z.infer<typeof routeContextSchema>) {
  try {
    const {params} = routeContextSchema.parse(context);

    const session = await getServerSession();
    if (!session?.user) {
      return new Response(null, {status: 403});
    }

    const happening = await prisma.happening.findUnique({
      where: {
        slug: params.slug,
      },
    });

    // Happening doesn't exist
    if (!happening) {
      return new Response(null, {status: 404});
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await req.json();
    const payload = payloadSchema.parse(body);

    const registration = await prisma.registration.update({
      where: {
        userId_happeningSlug: {
          userId: session.user.id,
          happeningSlug: params.slug,
        },
      },
      data: {
        reason: payload.reason,
        status: "DEREGISTERED",
      },
    });

    return new Response(registration.status, {status: 200});
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), {status: 400});
    }

    return new Response(null, {status: 500});
  }
}

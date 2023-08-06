import {NextResponse} from "next/server";
import {z} from "zod";

import {prisma} from "@echo-webkom/db";

import {withSession} from "@/lib/checks/with-session";

const routeContextSchema = z.object({
  params: z.object({
    slug: z.string(),
  }),
});

const payloadSchema = z.object({
  reason: z.string(),
});

export const POST = withSession(
  async ({ctx, user, input}) => {
    const happening = await prisma.happening.findUnique({
      where: {
        slug: ctx.params.slug,
      },
    });

    // Happening doesn't exist and/or doesn't have a date
    if (!happening?.date) {
      return new Response(null, {status: 404});
    }

    // Happening has already happened
    if (happening.date < new Date()) {
      return new Response(null, {status: 400});
    }

    await prisma.registration.update({
      where: {
        userId_happeningSlug: {
          userId: user.id,
          happeningSlug: ctx.params.slug,
        },
      },
      data: {
        reason: input.reason,
        status: "DEREGISTERED",
      },
    });

    return NextResponse.json({title: "Du er avmeldt"}, {status: 200});
  },
  routeContextSchema,
  payloadSchema,
);

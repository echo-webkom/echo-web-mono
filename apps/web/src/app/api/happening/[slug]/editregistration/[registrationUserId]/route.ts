import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@echo-webkom/db";

import { withSession } from "@/lib/checks/with-session";

const routeContextSchema = z.object({
  params: z.object({
    slug: z.string(),
  }),
});

type EnumRegistrationStatus = "REGISTERED" | "WAITLISTED" | "DEREGISTERED";

const payloadSchema = z.object({
  status: z.string().refine((status) => {
    return ["REGISTERED", "WAITLISTED", "DEREGISTERED"].includes(status as EnumRegistrationStatus);
  }),
});

export const PUT = withSession(
  async ({ ctx, user, input }) => {
    const slug =  ctx.params.slug;
    const happening = await prisma.happening.findUnique({
      where: {
        slug: slug,
      },
    });

    if (!happening?.date) {
      return new Response(null, { status: 404 });
    }

    if (happening.date < new Date()) {
      return new Response(null, { status: 400 });
    }

    await prisma.registration.update({
      where: {
        userId_happeningSlug: {
          userId: user.id,
          happeningSlug: ctx.params.slug,
        },
      },
      data: {
        status: input.status as EnumRegistrationStatus
        // Kan legge til flere felt her, feks changelog
      },
    });

    return NextResponse.json({ title: "Registrering oppdatert" }, { status: 200 });
  },
  routeContextSchema,
  payloadSchema,
);

import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@echo-webkom/db";
import { registrations } from "@echo-webkom/db/schemas";

import { withSession } from "@/lib/checks/with-session";

const routeContextSchema = z.object({
  params: z.object({
    slug: z.string(),
  }),
});

const payloadSchema = z.object({
  reason: z.string(),
});

export const POST = withSession(
  async ({ ctx, user, input }) => {
    const happening = await db.query.happenings.findFirst({
      where: (happening) => eq(happening.slug, ctx.params.slug),
    });

    // Happening doesn't exist and/or doesn't have a date
    if (!happening?.date) {
      return new Response(null, { status: 404 });
    }

    // Happening has already happened
    if (happening.date < new Date()) {
      return new Response(null, { status: 400 });
    }

    await db
      .update(registrations)
      .set({
        unregisterReason: input.reason,
        status: "unregistered",
      })
      .where(
        and(eq(registrations.userId, user.id), eq(registrations.happeningSlug, ctx.params.slug)),
      );

    return NextResponse.json({ title: "Du er avmeldt" }, { status: 200 });
  },
  routeContextSchema,
  payloadSchema,
);

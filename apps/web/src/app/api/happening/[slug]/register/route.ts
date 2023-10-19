import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@echo-webkom/db";
import { registrations, type RegistrationStatus } from "@echo-webkom/db/schemas";

import { withSession } from "@/lib/checks/with-session";

const routeContextSchema = z.object({
  params: z.object({
    slug: z.string(),
  }),
});

const payloadSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    }),
  ),
});

export const POST = withSession(
  async ({ ctx, user, input }) => {
    const happening = await db.query.happenings.findFirst({
      where: (happening) => eq(happening.slug, ctx.params.slug),
      with: {
        questions: true,
      },
    });

    if (!happening) {
      return NextResponse.json(
        {
          title: "En feil har skjedd",
          description: "Arrangementet du prøver å melde deg på finnes ikke.",
        },
        {
          status: 404,
        },
      );
    }

    // Happening is not open for registration
    if (!happening.registrationStart || !happening.registrationEnd) {
      return NextResponse.json(
        {
          title: "En feil har skjedd",
          description: "Det er ingen påmeldingsdato.",
        },
        {
          status: 403,
        },
      );
    }

    // Happening is not open for registration
    if (new Date() < happening.registrationStart || new Date() > happening.registrationEnd) {
      return NextResponse.json(
        {
          title: "En feil har skjedd",
          description: "Påmeldingen er ikke åpen.",
        },
        {
          status: 403,
        },
      );
    }

    // Insufficient information
    if (!user.degreeId || !user.year) {
      return NextResponse.json(
        {
          title: "En feil har skjedd",
          description: "Brukeren din mangler informasjon.",
        },
        {
          status: 403,
        },
      );
    }

    // Check if user is registered

    const allQuestionsAnswered = happening.questions.every((question) => {
      const answer = input.questions.find((answer) => answer.question === question.title);
      return !question.required || answer?.answer;
    });

    if (!allQuestionsAnswered) {
      return NextResponse.json(
        {
          title: "En feil har skjedd",
          description: "Du har ikke svart på alle spørsmålene.",
        },
        {
          status: 403,
        },
      );
    }

    const existingRegistration = await db.query.registrations.findFirst({
      where: (registrations) =>
        and(
          eq(registrations.happeningSlug, happening.slug),
          eq(registrations.userId, user.id),
          eq(registrations.status, "registered"),
        ),
    });

    if (existingRegistration) {
      return new Response(null, { status: 403 });
    }

    const spotRanges = await db.query.spotRanges.findMany({
      where: (spotRange) => eq(spotRange.happeningSlug, happening.slug),
    });

    const correctSpotRange = spotRanges.find((spotRange) => {
      const { minYear, maxYear } = spotRange;
      if (!minYear || !maxYear) {
        return true;
      }

      if (!user.year) {
        return false;
      }

      return user.year >= minYear && user.year <= maxYear;
    });

    if (!correctSpotRange) {
      return NextResponse.json(
        {
          title: "En feil har skjedd",
          description: "Du kan ikke melde deg på dette arrangementet.",
        },
        {
          status: 403,
        },
      );
    }

    const count = await db.transaction(
      async (tx) => {
        const c = await tx
          .select({
            count: sql<number>`COUNT(*)`,
          })
          .from(registrations)
          .where(
            and(
              eq(registrations.happeningSlug, happening.slug),
              eq(registrations.status, "registered"),
            ),
          )
          .then((res) => res[0]?.count ?? 0);

        return c;
      },
      {
        isolationLevel: "serializable",
      },
    );

    // Handle when spots === 0. Means infinite spots

    const status: RegistrationStatus =
      count < (correctSpotRange.spots ?? Number.POSITIVE_INFINITY) ? "registered" : "waiting";

    const registration = await db
      .insert(registrations)
      .values({
        userId: user.id,
        happeningSlug: happening.slug,
        status,
      })
      .returning()
      .then((res) => res[0] ?? null);

    if (!registration) {
      return NextResponse.json(
        {
          title: "En feil har skjedd",
          description: "Kunne ikke opprette påmeldingen.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        title: status === "registered" ? "Gratulere du har fått plass!" : "Du er på venteliste.",
      },
      {
        status: 200,
      },
    );
  },
  routeContextSchema,
  payloadSchema,
);

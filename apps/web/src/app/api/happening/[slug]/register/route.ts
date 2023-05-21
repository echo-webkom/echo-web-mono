import {NextResponse} from "next/server";
import {z} from "zod";

import {prisma} from "@echo-webkom/db/client";

import {withSession} from "@/lib/checks/with-session";

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
  async ({ctx, user}) => {
    const happening = await prisma.happening.findUnique({
      where: {
        slug: ctx.params.slug,
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
    if (!user.degree || !user.year) {
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

    // User is already registered
    const spotRange = await prisma.spotRange.findFirst({
      where: {
        happeningSlug: happening.slug,
        minDegreeYear: {
          lte: user.year,
        },
        maxDegreeYear: {
          gte: user.year,
        },
      },
    });

    if (!spotRange) {
      return NextResponse.json(
        {
          title: "En feil har skjedd",
          description: "Du kan ikke melde deg på dette arrangamentet.",
        },
        {
          status: 403,
        },
      );
    }

    const registration = await prisma.registration.findFirst({
      where: {
        happeningSlug: happening.slug,
        userId: user.id,
        status: "REGISTERED",
      },
    });

    if (registration) {
      return new Response(null, {status: 403});
    }

    const status = await prisma.$transaction(async (prisma) => {
      const registrationCount = await prisma.happening.count({
        where: {
          slug: ctx.params.slug,
          registrations: {
            some: {
              status: "REGISTERED",
            },
          },
          spotRanges: {
            some: {
              id: spotRange.id,
            },
          },
        },
      });

      const registrationStatus = registrationCount < spotRange.spots ? "REGISTERED" : "WAITLISTED";

      const registration = await prisma.registration.upsert({
        where: {
          userId_happeningSlug: {
            happeningSlug: ctx.params.slug,
            userId: user.id,
          },
        },
        update: {
          status: registrationStatus,
        },
        create: {
          status: registrationStatus,
          happeningSlug: ctx.params.slug,
          userId: user.id,
        },
      });

      return registration.status;
    });

    return NextResponse.json(
      {
        title: "Du er påmeldt!",
        description:
          status === "REGISTERED" ? "Gratulere du har fått plass!" : "Du er på venteliste.",
      },
      {
        status: 200,
      },
    );
  },
  routeContextSchema,
  payloadSchema,
);

import {z} from "zod";

import {prisma} from "@echo-webkom/db/client";

import {getServerSession} from "@/lib/session";

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

    // Happening is not open for registration
    if (!happening.registrationStart || !happening.registrationEnd) {
      return new Response(null, {status: 403});
    }

    // Happening is not open for registration
    if (new Date() < happening.registrationStart || new Date() > happening.registrationEnd) {
      return new Response(null, {status: 403});
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    // User doesn't exist
    if (!user) {
      return new Response(null, {status: 404});
    }

    // Insufficient information
    if (!user.degree || !user.year) {
      return new Response(null, {status: 403});
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
      return new Response(null, {status: 403});
    }

    const registration = await prisma.registration.findFirst({
      where: {
        happeningSlug: happening.slug,
        userId: user.id,
      },
    });

    if (registration) {
      return new Response(null, {status: 403});
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await req.json();
    const _payload = payloadSchema.parse(body);

    const status = await prisma.$transaction(async (prisma) => {
      const registrationCount = await prisma.happening.count({
        where: {
          slug: params.slug,
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
            happeningSlug: params.slug,
            userId: user.id,
          },
        },
        update: {
          status: registrationStatus,
        },
        create: {
          status: registrationStatus,
          happeningSlug: params.slug,
          userId: user.id,
        },
      });

      return registration.status;
    });

    return new Response(status, {status: status === "REGISTERED" ? 201 : 202});
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), {status: 422});
    }

    return new Response(null, {status: 500});
  }
}

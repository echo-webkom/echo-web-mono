import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@echo-webkom/db";

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
    const happening = await prisma.happening.findUnique({
      where: {
        slug: ctx.params.slug,
      },
      include: {
        questions: {
          select: {
            title: true,
            required: true,
            id: true,
          },
        },
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

    const registration = await prisma.registration.findFirst({
      where: {
        happeningSlug: happening.slug,
        userId: user.id,
        status: "REGISTERED",
      },
    });

    if (registration) {
      return new Response(null, { status: 403 });
    }

    const status = await prisma.$transaction(
      async (tx) => {
        const registrationCount = await tx.happening.count({
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

        if (registrationCount < spotRange.spots) {
          const registration = await tx.registration.upsert({
            where: {
              userId_happeningSlug: {
                happeningSlug: ctx.params.slug,
                userId: user.id,
              },
            },
            update: {
              status: "REGISTERED",
            },
            create: {
              status: "REGISTERED",
              happeningSlug: ctx.params.slug,
              userId: user.id,
            },
          });

          const answersToSave = [];

          for (var userAnswer of input.questions) {
            const foundQuestion = happening.questions.find((happeningQuestion) => {
              return happeningQuestion.title === userAnswer.question;
            });
            if (foundQuestion) {
              answersToSave.push({
                registrationId: registration.id,
                questionId: foundQuestion.id,
                text: userAnswer.answer,
              });
            }
          }

          await tx.answer.createMany({
            data: answersToSave,
          })

          return registration.status;
        } else {
          return "WAITLISTED";
        }
      },
      { isolationLevel: "Serializable" },
    );

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

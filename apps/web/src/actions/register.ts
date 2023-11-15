"use server";

import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { getAuth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";
import { answers, registrations, type AnswerInsert, type SpotRange } from "@echo-webkom/db/schemas";

const registerPayloadSchema = z.object({
  questions: z.array(
    z.object({
      questionId: z.string(),
      answer: z.string().optional().or(z.literal("")),
    }),
  ),
});

export async function register(id: string, payload: z.infer<typeof registerPayloadSchema>) {
  try {
    /**
     * Check if user is signed in
     */
    const user = await getAuth();

    if (!user) {
      return {
        success: false,
        message: "Du er ikke logget inn",
      };
    }

    /**
     * Check if user has filled out necessary information
     */
    if (!user.degreeId || !user.year) {
      return {
        success: false,
        message: "Du må ha fylt ut studieinformasjon for å kunne registrere deg",
      };
    }

    /**
     * Get happening, and check if it exists
     */
    const happening = await db.query.happenings.findFirst({
      where: (happening) => eq(happening.id, id),
      with: {
        questions: true,
      },
    });

    if (!happening) {
      return {
        success: false,
        message: "Arrangementet finnes ikke",
      };
    }

    /**
     * Check if user is already registered
     */
    const exisitingRegistration = await db.query.registrations.findFirst({
      where: (registration) =>
        and(
          eq(registration.happeningId, id),
          eq(registration.userId, user.id),
          eq(registration.status, "registered"),
        ),
    });

    if (exisitingRegistration) {
      return {
        success: false,
        message: "Du er allerede påmeldt dette arrangementet",
      };
    }

    /**
     * Check if registration is open
     */
    if (happening.registrationStart && new Date() < happening.registrationStart) {
      return {
        success: false,
        message: "Påmeldingen har ikke startet",
      };
    }

    /**
     * Check if registration is closed
     */
    if (happening.registrationEnd && new Date() > happening.registrationEnd) {
      return {
        success: false,
        message: "Påmeldingen har allerede stengt",
      };
    }

    /**
     * Get spot ranges for happening
     */
    const spotRanges = await db.query.spotRanges.findMany({
      where: (spotRange) => eq(spotRange.happeningId, id),
    });

    /**
     * Get correct spot range for user
     *
     * If user is not in any spot range, return error
     */
    const userSpotRange = getCorrectSpotrange(user.year, spotRanges);

    if (!userSpotRange) {
      return {
        success: false,
        message: "Du kan ikke melde deg på dette arrangementet",
      };
    }

    const data = await registerPayloadSchema.parseAsync(payload);

    /**
     * Check if all questions are answered
     */
    const allQuestionsAnswered = happening.questions.every((question) => {
      const questionExists = data.questions.find((q) => q.questionId === question.id);
      const questionAnswer = questionExists?.answer;

      return question.required ? !!questionAnswer : true;
    });

    if (!allQuestionsAnswered) {
      return {
        success: false,
        message: "Du må svare på alle spørsmålene",
      };
    }

    /**
     * Check amount of registrations for spot range, and insert registration
     */
    const { registration, isWaitlisted } = await db.transaction(
      async (tx) => {
        const spotRangeRegistrations = (
          await tx.query.registrations.findMany({
            where: (registration) => and(eq(registration.status, "registered")),
            with: {
              user: true,
            },
          })
        ).filter((registration) => {
          if (!registration.user.year) {
            return false;
          }
          const userSpotRange = getCorrectSpotrange(registration.user.year, spotRanges);
          return userSpotRange?.id === userSpotRange?.id;
        });

        const isWaitlisted =
          userSpotRange.spots === 0 || spotRangeRegistrations.length >= userSpotRange.spots;

        /**
         * Insert registration
         */
        const registration = await tx
          .insert(registrations)
          .values({
            happeningId: happening.id,
            userId: user.id,
            status: isWaitlisted ? "waiting" : "registered",
          })
          .onConflictDoUpdate({
            set: {
              status: sql`excluded.status`,
            },
            target: [registrations.happeningId, registrations.userId],
          })
          .returning()
          .then((res) => res[0] ?? null);

        return {
          registration,
          isWaitlisted,
        };
      },
      {
        isolationLevel: "serializable",
      },
    );

    if (!registration) {
      throw new Error("Could not create registration");
    }

    /**
     * Insert answers
     */
    const answersToInsert = data.questions.map(
      (question) =>
        ({
          happeningId: happening.id,
          userId: user.id,
          questionId: question.questionId,
          answer: question.answer,
        }) satisfies AnswerInsert,
    );

    if (answersToInsert.length > 0) {
      await db.insert(answers).values(answersToInsert).onConflictDoNothing();
    }

    return {
      success: true,
      message: isWaitlisted ? "Du er nå på venteliste" : "Du er nå påmeldt arrangementet",
    };
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Skjemaet er ikke i riktig format",
      };
    }

    return {
      success: false,
      message: "En feil har oppstått",
    };
  }
}

function getCorrectSpotrange(year: number, spotRanges: Array<SpotRange>) {
  return (
    spotRanges.find((spotRange) => {
      return year >= spotRange.minYear && year <= spotRange.maxYear;
    }) ?? null
  );
}

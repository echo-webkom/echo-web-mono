"use server";

import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { getAuth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";
import { answers, registrations } from "@echo-webkom/db/schemas";

const registerPayloadSchema = z.object({
  questions: z.array(
    z.object({
      questionId: z.string(),
      answer: z.string(),
    }),
  ),
});

export async function register(id: string, payload: z.infer<typeof registerPayloadSchema>) {
  try {
    const user = await getAuth();

    if (!user) {
      return {
        success: false,
        message: "Du er ikke logget inn",
      };
    }

    if (!user.degreeId || !user.year) {
      return {
        success: false,
        message: "Du må ha fylt ut studieinformasjon for å kunne registrere deg",
      };
    }

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

    if (happening.registrationStart && new Date() < happening.registrationStart) {
      return {
        success: false,
        message: "Påmeldingen har ikke startet",
      };
    }

    if (happening.registrationEnd && new Date() > happening.registrationEnd) {
      return {
        success: false,
        message: "Påmeldingen har allerede stengt",
      };
    }

    const spotRanges = await db.query.spotRanges.findMany({
      where: (spotRange) => eq(spotRange.happeningId, id),
    });
    if (spotRanges.length === 0) {
      spotRanges.push({
        id: "default",
        happeningId: happening.id,
        minYear: 0,
        maxYear: 1000,
        spots: 0,
      });
    }

    const userSpotRange = spotRanges.find((spotRange) => {
      // Error with typescript. We have already checked that user.degreeId and user.year is not null
      return user.year! >= spotRange.minYear && user.year! <= spotRange.maxYear;
    });

    if (!userSpotRange) {
      return {
        success: false,
        message: "Du kan ikke melde deg på dette arrangementet",
      };
    }

    const data = await registerPayloadSchema.parseAsync(payload);

    const allQuestionsAnswered = happening.questions.every((question) => {
      const questionExists = data.questions.find((q) => q.questionId === question.id);
      const hasAnswer = (questionExists && questionExists.answer.length > 0) ?? !question.required;
      return hasAnswer;
    });

    if (!allQuestionsAnswered) {
      return {
        success: false,
        message: "Du må svare på alle spørsmålene",
      };
    }

    const answersToInsert = data.questions.map((question) => ({
      happeningId: happening.id,
      userId: user.id,
      questionId: question.questionId,
      answer: question.answer,
    }));

    if (answersToInsert.length > 0) {
      await db.insert(answers).values(answersToInsert);
    }

    const numRegistrations = await db.transaction(
      async (tx) => {
        return tx
          .select({
            count: sql<number>`count(*)`,
          })
          .from(registrations)
          .where(
            and(
              eq(registrations.happeningId, happening.id),
              eq(registrations.spotrangeId, userSpotRange.id),
            ),
          )
          .then((res) => res[0]?.count ?? null);
      },
      {
        isolationLevel: "serializable",
      },
    );

    const isWatilisted =
      typeof numRegistrations === "number" && numRegistrations >= userSpotRange.spots;

    const registration = await db.insert(registrations).values({
      userId: user.id,
      happeningId: happening.id,
      spotrangeId: userSpotRange.id,
      status: isWatilisted ? "waiting" : "registered",
    });

    return {
      success: true,
      message: isWatilisted ? "Du er nå på venteliste" : "Du er nå påmeldt arrangementet",
      registration,
    };
  } catch (error) {
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

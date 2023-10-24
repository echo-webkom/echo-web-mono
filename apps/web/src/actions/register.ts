"use server";

import { and, asc, eq } from "drizzle-orm";
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

export async function register(slug: string, payload: z.infer<typeof registerPayloadSchema>) {
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
          eq(registration.happeningSlug, slug),
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
      where: (happening) => eq(happening.slug, slug),
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
      where: (spotRange) => eq(spotRange.happeningSlug, slug),
    });
    if (spotRanges.length === 0) {
      spotRanges.push({
        id: "default",
        happeningSlug: happening.slug,
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

    const registration = await db
      .insert(registrations)
      .values({
        happeningSlug: happening.slug,
        userId: user.id,
        status: "waiting",
      })
      .onConflictDoUpdate({
        target: [registrations.happeningSlug, registrations.userId],
        where: and(
          eq(registrations.happeningSlug, happening.slug),
          eq(registrations.userId, user.id),
        ),
        set: {
          status: "waiting",
        },
      })
      .returning()
      .then((res) => res[0] ?? null);

    if (!registration) {
      return {
        success: false,
        message: "En feil har oppstått",
      };
    }

    const answersToInsert = data.questions.map((question) => ({
      happeningSlug: happening.slug,
      userId: user.id,
      questionId: question.questionId,
      answer: question.answer,
    }));

    if (answersToInsert.length > 0) {
      await db.insert(answers).values(answersToInsert);
    }

    if (userSpotRange.spots === 0) {
      await db
        .update(registrations)
        .set({
          status: "registered",
        })
        .where(
          and(eq(registrations.happeningSlug, happening.slug), eq(registrations.userId, user.id)),
        );

      return {
        success: true,
        message: "Du er påmeldt",
      };
    }

    const currentlyRegistered = await db.query.registrations.findMany({
      where: (registration) =>
        and(eq(registration.happeningSlug, happening.slug), eq(registration.status, "registered")),
      orderBy: (registration) => asc(registration.createdAt),
      with: {
        user: true,
      },
    });

    const registrationsInSameSpotRange = currentlyRegistered.filter((registration) => {
      const user = registration.user;
      return user.year! >= userSpotRange.minYear && user.year! <= userSpotRange.maxYear;
    });

    const userSpotIndex = registrationsInSameSpotRange.findIndex(
      (r) => r.happeningSlug === registration.happeningSlug && r.userId === registration.userId,
    );
    const waitlistSpot = userSpotIndex - userSpotRange.spots;
    const isWaitlisted = waitlistSpot >= 0;

    if (!isWaitlisted) {
      await db
        .update(registrations)
        .set({
          status: "registered",
        })
        .where(
          and(eq(registrations.happeningSlug, happening.slug), eq(registrations.userId, user.id)),
        );
    }

    const message = isWaitlisted
      ? `Du er på venteliste. Plass nr. ${waitlistSpot}`
      : "Du er påmeldt";

    return {
      success: true,
      message,
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

"use server";

import * as va from "@vercel/analytics/server";
import { isFuture, isPast } from "date-fns";
import { and, eq, gte, lte, or, sql } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";
import {
  answers,
  registrations,
  users,
  type AnswerInsert,
  type SpotRange,
} from "@echo-webkom/db/schemas";

import { pingBoomtown } from "@/api/boomtown";
import { revalidateRegistrations } from "@/data/registrations/revalidate";
import { registrationFormSchema } from "@/lib/schemas/registration";
import { shortDateNoYear } from "@/utils/date";
import { doesIntersect } from "@/utils/list";

export async function register(id: string, payload: z.infer<typeof registrationFormSchema>) {
  /**
   * Check if user is signed in
   */
  const user = await auth();

  if (!user) {
    return {
      success: false,
      message: "Du er ikke logget inn",
    };
  }

  try {
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
          or(eq(registration.status, "registered"), eq(registration.status, "waiting")),
        ),
    });

    if (exisitingRegistration) {
      const status =
        exisitingRegistration.status === "registered"
          ? "Du er allerede påmeldt dette arrangementet"
          : "Du er allerede på venteliste til dette arrangementet";
      return {
        success: false,
        message: status,
      };
    }

    const canEarlyRegister = doesIntersect(
      happening.registrationGroups ?? [],
      user.memberships.map((membership) => membership.group.id),
    );

    /**
     * Check if registration is open for user that can not early register
     */
    if (!canEarlyRegister && happening.registrationStart && isFuture(happening.registrationStart)) {
      return {
        success: false,
        message: "Påmeldingen har ikke startet",
      };
    }

    if (!canEarlyRegister && !happening.registrationStart) {
      return {
        success: false,
        message: "Påmelding er bare for inviterte undergrupper",
      };
    }

    /**
     * Check if registration is closed for user that can not early register
     */
    if (happening.registrationEnd && isPast(happening.registrationEnd)) {
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
     * Get groups that host the happening
     */
    const hostGroups = await db.query.happeningsToGroups
      .findMany({
        where: (happeningToGroup) => eq(happeningToGroup.happeningId, id),
      })
      .then((groups) => groups.map((group) => group.groupId));

    const canSkipSpotRange = doesIntersect(
      hostGroups,
      user.memberships.map((membership) => membership.group.id),
    );

    /**
     * Get correct spot range for user
     *
     * If user is not in any spot range, return error
     */
    const userSpotRange = getCorrectSpotrange(user.year, spotRanges, canSkipSpotRange);

    if (!userSpotRange) {
      return {
        success: false,
        message: "Du kan ikke melde deg på dette arrangementet",
      };
    }

    const data = await registrationFormSchema.parseAsync(payload);

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

    const { registration, isWaitlisted } = await db.transaction(
      async (tx) => {
        await tx.execute(sql`LOCK TABLE ${registrations} IN EXCLUSIVE MODE`);

        const regs = await tx
          .select()
          .from(registrations)
          .where(
            and(
              eq(registrations.happeningId, id),
              lte(users.year, userSpotRange.maxYear),
              gte(users.year, userSpotRange.minYear),
              or(eq(registrations.status, "registered"), eq(registrations.status, "waiting")),
            ),
          )
          .leftJoin(users, eq(registrations.userId, users.id));

        const isWaitlisted = regs.length >= userSpotRange.spots;

        const registration = await tx
          .insert(registrations)
          .values({
            registrationChangedAt: isWaitlisted
              ? `Påmeldt venteliste ${shortDateNoYear(new Date())}`
              : `Påmeldt ${shortDateNoYear(new Date())}`,
            status: isWaitlisted ? "waiting" : "registered",
            happeningId: id,
            userId: user.id,
          })
          .returning()
          .onConflictDoUpdate({
            target: [registrations.happeningId, registrations.userId],
            set: {
              registrationChangedAt: isWaitlisted
                ? `Påmeldt venteliste ${shortDateNoYear(new Date())}`
                : `Påmeldt ${shortDateNoYear(new Date())}`,
              status: isWaitlisted ? "waiting" : "registered",
            },
          })
          .then((res) => res[0] ?? null);

        return {
          registration,
          isWaitlisted,
        };
      },
      {
        isolationLevel: "read committed",
      },
    );

    revalidateRegistrations(id, user.id);

    if (!registration) {
      throw new Error("Failed to update registration");
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
          answer: question.answer
            ? {
                answer: question.answer,
              }
            : null,
        }) satisfies AnswerInsert,
    );

    if (answersToInsert.length > 0) {
      await db.insert(answers).values(answersToInsert).onConflictDoNothing();
    }

    await va.track("Successful reigstration", {
      userId: user.id,
      happeningId: happening.id,
    });

    void (async () => {
      await pingBoomtown(id);
    })();

    return {
      success: true,
      message: isWaitlisted ? "Du er nå på venteliste" : "Du er nå påmeldt arrangementet",
    };
  } catch (error) {
    console.error(`Error in register: ${error}`);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Skjemaet er ikke i riktig format",
      };
    }

    await va.track("Failed registration", {
      userId: user?.id ?? null,
      happeningId: id ?? null,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return {
      success: false,
      message: "En feil har oppstått",
    };
  }
}

function getCorrectSpotrange(
  year: number,
  spotRanges: Array<SpotRange>,
  canSkipSpotRange: boolean,
) {
  return (
    spotRanges.find((spotRange) => {
      if (canSkipSpotRange) {
        return true;
      }

      return year >= spotRange.minYear && year <= spotRange.maxYear;
    }) ?? null
  );
}

"use server";

import * as va from "@vercel/analytics/server";
import { isFuture, isPast } from "date-fns";
import { and, eq, gte, lte, or, sql } from "drizzle-orm";
import { z } from "zod";

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
import { isUserBannedFromBedpres } from "@/lib/ban-info";
import { authedAction } from "@/lib/safe-actions";
import { registrationFormSchema } from "@/lib/schemas/registration";
import { shortDateNoYear } from "@/utils/date";
import { doesIntersect } from "@/utils/list";

export const register = authedAction
  .input(
    z.object({
      id: z.string(),
      registration: registrationFormSchema,
    }),
  )
  .create(async ({ input, ctx }) => {
    /**
     * Check if user has filled out necessary information
     */
    if (!ctx.user.degreeId || !ctx.user.year) {
      throw new Error("Du må ha fylt ut studieinformasjon for å kunne registrere deg");
    }

    /**
     * Get happening, and check if it exists
     */
    const happening = await db.query.happenings.findFirst({
      where: (happening) => eq(happening.id, input.id),
      with: {
        questions: true,
      },
    });

    if (!happening) {
      throw new Error("Arrangementet finnes ikke");
    }

    /**
     * Check if user is banned
     */
    const isBanned =
      ctx.user.isBanned && happening.type === "bedpres"
        ? await isUserBannedFromBedpres(ctx.user, happening)
        : false;

    if (isBanned) {
      throw new Error("Du er utestengt fra denne bedriftspresentasjonen");
    }

    /**
     * Check if user is already registered
     */
    const exisitingRegistration = await db.query.registrations.findFirst({
      where: (registration) =>
        and(
          eq(registration.happeningId, input.id),
          eq(registration.userId, ctx.user.id),
          or(eq(registration.status, "registered"), eq(registration.status, "waiting")),
        ),
    });

    if (exisitingRegistration) {
      const status =
        exisitingRegistration.status === "registered"
          ? "Du er allerede påmeldt dette arrangementet"
          : "Du er allerede på venteliste til dette arrangementet";
      throw new Error(status);
    }

    const canEarlyRegister = doesIntersect(
      happening.registrationGroups ?? [],
      ctx.user.memberships.map((membership) => membership.group.id),
    );

    /**
     * Check if registration is open for user that can not early register
     */
    if (!canEarlyRegister && happening.registrationStart && isFuture(happening.registrationStart)) {
      throw new Error("Påmeldingen har ikke startet");
    }

    if (!canEarlyRegister && !happening.registrationStart) {
      throw new Error("Påmelding er bare for inviterte undergrupper");
    }

    /**
     * Check if registration is closed for user that can not early register
     */
    if (happening.registrationEnd && isPast(happening.registrationEnd)) {
      throw new Error("Påmeldingen har allerede stengt");
    }

    /**
     * Get spot ranges for happening
     */
    const spotRanges = await db.query.spotRanges.findMany({
      where: (spotRange) => eq(spotRange.happeningId, input.id),
    });

    /**
     * Get groups that host the happening
     */
    const hostGroups = await db.query.happeningsToGroups
      .findMany({
        where: (happeningToGroup) => eq(happeningToGroup.happeningId, input.id),
      })
      .then((groups) => groups.map((group) => group.groupId));

    const canSkipSpotRange = doesIntersect(
      hostGroups,
      ctx.user.memberships.map((membership) => membership.group.id),
    );

    /**
     * Get correct spot range for user
     *
     * If user is not in any spot range, return error
     */
    const userSpotRange = getCorrectSpotrange(ctx.user.year, spotRanges, canSkipSpotRange);

    if (!userSpotRange) {
      throw new Error("Du kan ikke melde deg på dette arrangementet");
    }

    /**
     * Check if all questions are answered
     */
    const allQuestionsAnswered = happening.questions.every((question) => {
      const questionExists = input.registration.questions.find((q) => q.questionId === question.id);
      const questionAnswer = questionExists?.answer;

      return question.required ? !!questionAnswer : true;
    });

    if (!allQuestionsAnswered) {
      throw new Error("Du må svare på alle spørsmålene");
    }

    const { registration, isWaitlisted } = await db.transaction(
      async (tx) => {
        await tx.execute(sql`LOCK TABLE ${registrations} IN EXCLUSIVE MODE`);

        const regs = await tx
          .select()
          .from(registrations)
          .where(
            and(
              eq(registrations.happeningId, input.id),
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
            happeningId: input.id,
            userId: ctx.user.id,
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

    if (!registration) {
      await va.track("Failed registration", {
        userId: ctx.user.id,
        happeningId: happening.id,
      });

      throw new Error("Failed to update registration");
    }

    /**
     * Insert answers
     */
    const answersToInsert = input.registration.questions.map(
      (question) =>
        ({
          happeningId: happening.id,
          userId: ctx.user.id,
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

    revalidateRegistrations(input.id, ctx.user.id);

    await va.track("Successful reigstration", {
      userId: ctx.user.id,
      happeningId: happening.id,
    });

    void (async () => {
      await pingBoomtown(input.id);
    })();

    return isWaitlisted ? "Du er nå på venteliste" : "Du er nå påmeldt arrangementet";
  });

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

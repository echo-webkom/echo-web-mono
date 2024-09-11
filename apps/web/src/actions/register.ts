"use server";

import { type z } from "zod";

import { db } from "@echo-webkom/db";
import {
  answers,
  registrations,
  users,
  type AnswerInsert,
  type SpotRange,
} from "@echo-webkom/db/schemas";

import { revalidateRegistrations } from "@/data/registrations/revalidate";
import { isUserBannedFromBedpres } from "@/lib/ban-info";
import { getUser } from "@/lib/get-user";
import { type registrationFormSchema } from "@/lib/schemas/registration";

export const register = async (id: string, payload: z.infer<typeof registrationFormSchema>) => {
  const user = await getUser();

  if (!user) {
    console.error("User not found", {
      happeningId: id,
    });
    return {
      success: false,
      message: "Du er ikke logget inn",
    };
  }

  const happeningId = id;
  const userId = user.id;
  const questions = payload.questions;

  try {
    const resp = await apiServer
      .post("admin/register", {
        json: {
          happeningId,
          userId,
          questions,
        },
      })
      .json<{ success: boolean; message: string }>();

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
      console.error("User is not in any spot range", {
        userId: user.id,
        happeningId: id,
      });
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
      console.error("Not all questions are answered", {
        userId: user.id,
        happeningId: id,
      });
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

        const isInfiniteSpots = userSpotRange.spots === 0;
        const isWaitlisted = !isInfiniteSpots && regs.length >= userSpotRange.spots;

        const registration = await tx
          .insert(registrations)
          .values({
            status: isWaitlisted ? "waiting" : "registered",
            happeningId: id,
            userId: user.id,
            changedBy: null,
          })
          .returning()
          .onConflictDoUpdate({
            target: [registrations.happeningId, registrations.userId],
            set: {
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

    console.info("Successful registration", {
      userId: user.id,
      happeningId: happening.id,
      isWaitlisted,
    });

    return {
      success: true,
      message: isWaitlisted ? "Du er nå på venteliste" : "Du er nå påmeldt arrangementet",
    };
  } catch (error) {
    console.error("Failed to register");

    return {
      success: false,
      message: "Noe gikk galt på serveren. Kontakt en i Webkom.",
    };
  }
};

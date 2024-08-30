import { and, eq, gte, lte, or, sql } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import {
  answers,
  registrations,
  users,
  type AnswerInsert,
  type SpotRange,
} from "@echo-webkom/db/schemas";

import { type RegisterJson } from "./schema";

export type DBUser = Exclude<Awaited<ReturnType<typeof getUser>>, undefined>;

export const getUser = async (userId: string) => {
  return await db.query.users.findFirst({
    where: (row, { eq }) => eq(row.id, userId),
    columns: {
      id: true,
      degreeId: true,
      year: true,
      hasReadTerms: true,
      bannedFromStrike: true,
      isBanned: true,
    },
    with: {
      memberships: {
        columns: {
          groupId: true,
        },
      },
    },
  });
};

export type DBHappening = Exclude<Awaited<ReturnType<typeof getHappening>>, undefined>;

export const getHappening = async (happeningId: string) => {
  return await db.query.happenings.findFirst({
    where: (row, { eq }) => eq(row.id, happeningId),
    columns: {
      id: true,
      type: true,
      date: true,
      registrationStart: true,
      registrationEnd: true,
      registrationGroups: true,
    },
    with: {
      questions: true,
      spotRanges: true,
    },
  });
};

export const getStrike = async (strikeId: number) => {
  return await db.query.strikes.findFirst({
    where: (row, { eq }) => eq(row.id, strikeId),
    with: {
      strikeInfo: true,
    },
  });
};

export const getHappeningsFromDateToDate = async (fromDate: Date, toDate: Date) => {
  return await db.query.happenings.findMany({
    where: (happening, { and, eq, gt, lt }) =>
      and(eq(happening.type, "bedpres"), gt(happening.date, fromDate), lt(happening.date, toDate)),
    with: {
      spotRanges: true,
    },
    orderBy: (happening, { asc }) => [asc(happening.date)],
  });
};

export const getExisitingRegistration = async (userId: string, happeningId: string) => {
  return await db.query.registrations.findFirst({
    where: (registration, { and, eq, or }) =>
      and(
        eq(registration.userId, userId),
        eq(registration.happeningId, happeningId),
        or(eq(registration.status, "registered"), eq(registration.status, "waiting")),
      ),
    columns: {
      status: true,
    },
  });
};

export const getHostGroups = async (id: string) => {
  return await db.query.happeningsToGroups
    .findMany({
      where: (happeningToGroup, { eq }) => eq(happeningToGroup.happeningId, id),
    })
    .then((groups) => groups.map((group) => group.groupId));
};

export const registerUserToHappening = async (
  userId: string,
  happeningId: string,
  spotRange: SpotRange,
) => {
  return await db.transaction(
    async (tx) => {
      await tx.execute(sql`LOCK TABLE ${registrations} IN EXCLUSIVE MODE`);

      const regs = await tx
        .select()
        .from(registrations)
        .where(
          and(
            eq(registrations.happeningId, happeningId),
            lte(users.year, spotRange.maxYear),
            gte(users.year, spotRange.minYear),
            or(eq(registrations.status, "registered"), eq(registrations.status, "waiting")),
          ),
        )
        .leftJoin(users, eq(registrations.userId, users.id));

      const isInfiniteSpots = spotRange.spots === 0;
      const isWaitlisted = !isInfiniteSpots && regs.length >= spotRange.spots;

      const registration = await tx
        .insert(registrations)
        .values({
          status: isWaitlisted ? "waiting" : "registered",
          happeningId,
          userId,
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

      if (!registration) {
        return "error" as const;
      }

      return isWaitlisted ? "waitlisted" : ("registered" as const);
    },
    {
      isolationLevel: "read committed",
    },
  );
};

export const insertAnswers = async (
  happeningId: string,
  userId: string,
  questions: RegisterJson["questions"],
) => {
  const answersToInsert = questions.map(
    (question) =>
      ({
        happeningId: happeningId,
        userId: userId,
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
};

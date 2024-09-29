import { isFuture, isPast } from "date-fns";
import { and, eq, gte, lte, or, sql } from "drizzle-orm";
import { z } from "zod";

import { AnswerInsert, answers, comments, registrations, users } from "@echo-webkom/db/schemas";

import { createApp } from "../lib/hono";
import { admin } from "../middleware/admin";
import { getCorrectSpotrange } from "../utils/correct-spot-range";
import { parseJson } from "../utils/json";

const app = createApp();

app.get("/admin/comments/:id", admin(), async (c) => {
  const { id } = c.req.param();

  const comments = await c.var.db.query.comments.findMany({
    where: (comment, { eq }) => eq(comment.postId, id),
    orderBy: (comment, { desc }) => [desc(comment.createdAt)],
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return c.json(comments);
});

app.post("/admin/comments", admin(), async (c) => {
  const { ok, json } = await parseJson(
    c,
    z.object({
      content: z.string(),
      postId: z.string(),
      userId: z.string(),
      parentCommentId: z.string().optional(),
    }),
  );

  if (!ok) {
    return c.json({ error: "Invalid data" }, 400);
  }

  const { content, postId, userId, parentCommentId } = json;

  await c.var.db.insert(comments).values({
    content,
    postId,
    userId,
    parentCommentId,
  });

  return c.json({ success: true });
});

app.post("/admin/register", admin(), async (c) => {
  const { ok, json } = await parseJson(
    c,
    z.object({
      userId: z.string(),
      happeningId: z.string(),
      questions: z.array(
        z.object({
          questionId: z.string(),
          answer: z.string(),
        }),
      ),
    }),
  );

  if (!ok) {
    return c.json({ error: "Invalid data" }, 400);
  }

  const { userId, happeningId, questions } = json;

  const user = await c.var.db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, userId),
    with: {
      memberships: true,
    },
  });

  if (!user) {
    console.error("User not found", {
      userId,
    });
    return c.json(
      {
        success: false,
        message: "Brukeren finnes ikke",
      },
      400,
    );
  }

  if (!user.degreeId || !user.year || !user.hasReadTerms) {
    return c.json(
      {
        success: false,
        message: "Du må ha fylt ut studieinformasjon for å kunne registrere deg",
      },
      400,
    );
  }

  const happening = await c.var.db.query.happenings.findFirst({
    where: (happening) => eq(happening.id, happeningId),
    with: {
      questions: true,
    },
  });

  if (!happening) {
    console.error("Happening not found", {
      happeningId,
    });
    return c.json(
      {
        success: false,
        message: "Arrangementet finnes ikke",
      },
      400,
    );
  }

  /**
   * Check if user is already registered
   */
  const exisitingRegistration = await c.var.db.query.registrations.findFirst({
    where: (registration) =>
      and(
        eq(registration.happeningId, happeningId),
        eq(registration.userId, userId),
        or(eq(registration.status, "registered"), eq(registration.status, "waiting")),
      ),
  });

  if (exisitingRegistration) {
    console.error("Registration already exists", {
      userId,
      happeningId,
    });
    const status =
      exisitingRegistration.status === "registered"
        ? "Du er allerede påmeldt dette arrangementet"
        : "Du er allerede på venteliste til dette arrangementet";
    return c.json(
      {
        success: false,
        message: status,
      },
      400,
    );
  }

  const canEarlyRegister = happening.registrationGroups?.some((group) =>
    user.memberships.map((membership) => membership.groupId).includes(group),
  );

  /**
   * Check if registration is open for user that can not early register
   */
  if (!canEarlyRegister && happening.registrationStart && isFuture(happening.registrationStart)) {
    console.error("Registration is not open", {
      userId: userId,
      happeningId,
    });
    return c.json(
      {
        success: false,
        message: "Påmeldingen har ikke startet",
      },
      400,
    );
  }

  if (!canEarlyRegister && !happening.registrationStart) {
    console.error("Registration is not open", {
      userId,
      happeningId,
    });
    return c.json(
      {
        success: false,
        message: "Påmelding er bare for inviterte undergrupper",
      },
      400,
    );
  }

  /**
   * Check if registration is closed for user that can not early register
   */
  if (happening.registrationEnd && isPast(happening.registrationEnd)) {
    console.error("Registration is closed", {
      userId,
      happeningId,
    });
    return c.json(
      {
        success: false,
        message: "Påmeldingen har allerede stengt",
      },
      400,
    );
  }

  /**
   * Get spot ranges for happening
   */
  const spotRanges = await c.var.db.query.spotRanges.findMany({
    where: (spotRange) => eq(spotRange.happeningId, happeningId),
  });

  /**
   * Get groups that host the happening
   */
  const hostGroups = await c.var.db.query.happeningsToGroups
    .findMany({
      where: (happeningToGroup) => eq(happeningToGroup.happeningId, happeningId),
    })
    .then((groups) => groups.map((group) => group.groupId));

  const canSkipSpotRange = hostGroups.some((group) =>
    user.memberships.map((membership) => membership.groupId).includes(group),
  );

  /**
   * Get correct spot range for user
   *
   * If user is not in any spot range, return error
   */
  const userSpotRange = getCorrectSpotrange(user.year, spotRanges, canSkipSpotRange);

  if (!userSpotRange) {
    console.error("User is not in any spot range", {
      userId,
      happeningId,
    });
    return c.json(
      {
        success: false,
        message: "Du kan ikke melde deg på dette arrangementet",
      },
      400,
    );
  }

  /**
   * Check if all questions are answered
   */
  const allQuestionsAnswered = happening.questions.every((question) => {
    const questionExists = questions.find((q) => q.questionId === question.id);
    const questionAnswer = questionExists?.answer;

    return question.required ? !!questionAnswer : true;
  });

  if (!allQuestionsAnswered) {
    console.error("Not all questions are answered", {
      userId,
      happeningId,
    });
    return c.json(
      {
        success: false,
        message: "Du må svare på alle spørsmålene",
      },
      400,
    );
  }

  const { registration, isWaitlisted } = await c.var.db.transaction(
    async (tx) => {
      await tx.execute(sql`LOCK TABLE ${registrations} IN EXCLUSIVE MODE`);

      const regs = await tx
        .select()
        .from(registrations)
        .where(
          and(
            eq(registrations.happeningId, happeningId),
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
    throw new Error("Failed to update registration");
  }

  /**
   * Insert answers
   */
  const answersToInsert = questions.map(
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
    await c.var.db.insert(answers).values(answersToInsert).onConflictDoNothing();
  }

  console.info("Successful registration", {
    userId: user.id,
    happeningId: happening.id,
    isWaitlisted,
  });

  return c.json({
    success: true,
    message: isWaitlisted ? "Du er nå på venteliste" : "Du er nå påmeldt arrangementet",
  });
});

export default app;

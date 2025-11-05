import { isFuture, isPast } from "date-fns";
import { and, eq, gte, inArray, lte, or, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import {
  answers,
  comments,
  commentsReactions,
  officeBookings,
  registrations,
  usersToGroups,
  type AnswerInsert,
} from "@echo-webkom/db/schemas";

import { Logger } from "@/lib/logger";
import { fitsInSpotrange, isAvailableSpot } from "@/utils/is-available-spot";
import { validateQuestions } from "@/utils/validate-questions";
import { db } from "../lib/db";
import { admin } from "../middleware/admin";
import { parseJson } from "../utils/json";

const app = new Hono();

app.get("/admin/comments/:id", admin(), async (c) => {
  const { id } = c.req.param();

  const comments = await db.query.comments.findMany({
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
      reactions: true,
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

  await db.insert(comments).values({
    content,
    postId,
    userId,
    parentCommentId,
  });

  return c.json({ success: true });
});

app.post("/admin/comments/:id/reaction", admin(), async (c) => {
  const { ok, json } = await parseJson(
    c,
    z.object({
      commentId: z.string(),
      userId: z.string(),
    }),
  );

  if (!ok) {
    return c.json({ error: "Invalid data" }, 400);
  }

  const existingReaction = await db.query.commentsReactions.findFirst({
    where: (reaction, { eq }) =>
      and(eq(reaction.commentId, json.commentId), eq(reaction.userId, json.userId)),
  });

  if (!existingReaction) {
    await db.insert(commentsReactions).values({
      commentId: json.commentId,
      userId: json.userId,
      type: "like",
    });
  } else {
    await db
      .delete(commentsReactions)
      .where(
        and(
          eq(commentsReactions.commentId, json.commentId),
          eq(commentsReactions.userId, json.userId),
        ),
      );
  }

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
          answer: z.string().or(z.array(z.string())),
        }),
      ),
    }),
  );

  if (!ok) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await c.req.json();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Logger.error("Invalid data", data);

    return c.json({ error: "Invalid data" }, 400);
  }

  const { userId, happeningId, questions } = json;

  const user = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, userId),
    with: {
      memberships: true,
      banInfo: true,
    },
  });

  if (!user) {
    Logger.warn("User not found", {
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
    Logger.warn("User has not filled out study information", {
      userId,
    });

    return c.json(
      {
        success: false,
        message: "Du må ha fylt ut studieinformasjon for å kunne registrere deg",
      },
      400,
    );
  }

  const happening = await db.query.happenings.findFirst({
    where: (happening) => eq(happening.id, happeningId),
    with: {
      questions: true,
    },
  });

  if (!happening) {
    Logger.error("Happening not found", {
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

  if (happening.type === "bedpres" && user.banInfo && isFuture(user.banInfo.expiresAt)) {
    Logger.warn("User is banned", {
      userId,
    });

    return c.json(
      {
        success: false,
        message: "Du er bannet",
      },
      400,
    );
  }

  /**
   * Check if user is already registered
   */
  const exisitingRegistration = await db.query.registrations.findFirst({
    where: (registration) =>
      and(
        eq(registration.happeningId, happeningId),
        eq(registration.userId, userId),
        or(eq(registration.status, "registered"), eq(registration.status, "waiting")),
      ),
  });

  if (exisitingRegistration) {
    Logger.warn("Registration already exists", {
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
    Logger.warn("Registration is not open", {
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
    Logger.warn("Registration is not open", {
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
    Logger.warn("Registration is closed", {
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
  const spotRanges = await db.query.spotRanges.findMany({
    where: (spotRange) => eq(spotRange.happeningId, happeningId),
  });

  /**
   * Get groups that host the happening
   */
  const hostGroups = await db.query.happeningsToGroups
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
  const userIsEligible =
    spotRanges.some((spotRange) => fitsInSpotrange(user, spotRange)) || canSkipSpotRange;

  if (!userIsEligible) {
    Logger.warn("User is not in any spot range", {
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
  const allQuestionsAnswered = validateQuestions(happening.questions, questions);

  if (!allQuestionsAnswered) {
    Logger.warn("Not all questions are answered", {
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

  const { registration, isWaitlisted } = await db.transaction(
    async (tx) => {
      await tx.execute(sql`LOCK TABLE ${registrations} IN EXCLUSIVE MODE`);

      const regs = await tx.query.registrations.findMany({
        where: and(
          eq(registrations.happeningId, happeningId),
          or(eq(registrations.status, "registered"), eq(registrations.status, "waiting")),
        ),
        with: {
          user: {
            with: {
              memberships: {
                where: inArray(usersToGroups.groupId, hostGroups),
              },
            },
          },
        },
      });

      const regsWithIsHost = regs.map(({ user: { memberships, ...user }, ...registration }) => ({
        ...registration,
        user: { ...user, isHost: memberships.length !== 0 },
      }));

      const isRegistered = isAvailableSpot(spotRanges, regsWithIsHost, user, canSkipSpotRange);

      const registration = await tx
        .insert(registrations)
        .values({
          status: isRegistered ? "registered" : "waiting",
          happeningId,
          userId,
          changedBy: null,
        })
        .returning()
        .onConflictDoUpdate({
          target: [registrations.happeningId, registrations.userId],
          set: {
            status: isRegistered ? "registered" : "waiting",
          },
        })
        .then((res) => res[0] ?? null);

      return {
        registration,
        isWaitlisted: !isRegistered,
      };
    },
    {
      isolationLevel: "read committed",
    },
  );

  if (!registration) {
    Logger.error("Failed to update registration", {
      userId,
      happeningId,
    });

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
    await db.insert(answers).values(answersToInsert).onConflictDoNothing();
  }

  Logger.info("Successfully registered user", {
    userId: user.id,
    happeningId: happening.id,
    isWaitlisted,
  });

  return c.json({
    success: true,
    message: isWaitlisted ? "Du er nå på venteliste" : "Du er nå påmeldt arrangementet",
  });
});

app.get("/admin/whitelist", admin(), async (c) => {
  const whitelist = await db.query.whitelist
    .findMany()
    .then((res) =>
      res.sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()),
    )
    .then((res) => res.filter((row) => isFuture(row.expiresAt)));

  return c.json(whitelist);
});

app.get("/admin/whitelist/:email", admin(), async (c) => {
  const { email } = c.req.param();
  const whitelist = await db.query.whitelist.findFirst({
    where: (row, { eq }) => eq(row.email, email),
  });

  return c.json(whitelist ?? null);
});

app.get("/admin/access-requests", admin(), async (c) => {
  const accessRequests = await db.query.accessRequests.findMany();

  return c.json(accessRequests);
});

// app.post("/admin/bookings", admin(), async (c) => {
//   const { ok, json } = await parseJson(
//     c,
//     z.object({
//       title: z.string().min(1),
//       startTime: z.string().refine((s) => !Number.isNaN(Date.parse(s)), "Invalid date format"),
//       endTime: z.string().refine((s) => !Number.isNaN(Date.parse(s)), "Invalid date format"),
//       userId: z.string().optional(),
//     }),
//   );

//   if (!ok) {
//     return c.json({ error: "Invalid data" }, 400);
//   }

//   console.log("Received booking data:", json);
//   const { title, startTime, endTime, userId } = json;

//   if (!userId) {
//     return c.json({ error: "User ID is required" }, 400);
//   }

//   // Check if time is already passed
//   if (isPast(new Date(startTime)) || isPast(new Date(endTime))) {
//     return c.json({ error: "Cannot create booking in the past" }, 400);
//   }

//   // Check if end time is after start time
//   if (new Date(endTime) <= new Date(startTime)) {
//     return c.json({ error: "End time must be after start time" }, 400);
//   }

//   // Check if spot is available
//   const overlappingBookings = await db.query.officeBookings.findMany({
//     where: (booking, { or, and, lt, gt }) =>
//       or(
//         and(lt(booking.startTime, new Date(endTime)), gt(booking.endTime, new Date(startTime))),
//         and(gte(booking.startTime, new Date(startTime)), lte(booking.startTime, new Date(endTime))),
//         and(gte(booking.endTime, new Date(startTime)), lte(booking.endTime, new Date(endTime))),
//       ),
//   });

//   if (overlappingBookings.length > 0) {
//     return c.json({ error: "Time slot is already booked" }, 400);
//   }

//   // Create booking
//   const [created] = await db
//     .insert(officeBookings)
//     .values({
//       title,
//       startTime: new Date(startTime),
//       endTime: new Date(endTime),
//       userId,
//     })
//     .returning();

//   console.log("Created booking:", created);
//   return c.json({ success: true, booking: created });
// });

app.post("/bookings", admin(), async (c) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = await c.req.json();
  const schema = z.object({
    title: z.string().min(1),
    startTime: z.string(),
    endTime: z.string(),
    userId: z.string(),
  });

  const result = schema.safeParse(body);
  if (!result.success) return c.json({ success: false, error: "Invalid data" }, 400);

  const bookingData = {
    ...result.data,
    startTime: new Date(result.data.startTime),
    endTime: new Date(result.data.endTime),
  };

  const [created] = await db.insert(officeBookings).values(bookingData).returning();
  return c.json({ success: true, booking: created });
});

export default app;

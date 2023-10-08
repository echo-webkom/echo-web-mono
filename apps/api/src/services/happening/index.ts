import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { DatabaseError } from "pg";
import { z } from "zod";

import { yearToNumber } from "@echo-webkom/lib";
import {
  answers,
  db,
  getHappening,
  getSpotRangeByHappening,
  registrations,
} from "@echo-webkom/storage";

import { sendUnregisterEmail } from "@/email/unregister";
import { getJwtPayload, jwtConfig } from "@/lib/jwt";
import { registrationSchema, unregisterSchema } from "./schemas";

const happeningService = new Hono();

/**
 * Get information about a specific happening
 */
happeningService.get("/happening/:slug", async (c) => {
  const { slug } = c.req.param();

  const happening = await getHappening(slug);

  if (!happening) {
    c.status(404);
    return c.text("Happening not found");
  }

  return c.json(happening);
});

/**
 * Get all registrations for a specific happening
 */
happeningService.get("/happening/:slug/registrations", jwt(jwtConfig), async (c) => {
  const { slug } = c.req.param();

  const happening = await db.query.happenings.findFirst({
    where: (h) => eq(h.slug, slug),
  });

  if (!happening) {
    c.status(404);
    return c.text("No happening found");
  }

  const registrations = await db.query.registrations.findMany({
    where: (r) => eq(r.happeningSlug, happening.slug),
  });

  return c.json(registrations);
});

/**
 * Register a user for a specific happening
 */
happeningService.post("/happening/:slug/register", jwt(jwtConfig), async (c) => {
  try {
    const { slug } = c.req.param();

    if (!slug) {
      c.status(400);
      return c.text("No slug provided");
    }

    const jwt = getJwtPayload(c);

    const user = await db.query.users.findFirst({
      where: (u) => eq(u.id, jwt.sub),
    });

    if (!user) {
      c.status(403);
      return c.text("Not logged in");
    }

    if (!user.year || !user.degree) {
      c.status(400);
      return c.text("Missing year or degree");
    }

    const happening = await getHappening(slug);

    if (!happening) {
      c.status(404);
      return c.text("No happening found");
    }

    const existingRegistration = await db.query.registrations.findFirst({
      where: (r) => and(eq(r.happeningSlug, happening.slug), eq(r.userId, user.id)),
    });

    if (existingRegistration?.status === "registered") {
      c.status(400);
      return c.text("Already registered");
    }

    const correctSpotRange = happening.spotRanges.find((sr) => {
      return yearToNumber(sr.minYear) <= yearToNumber(user.year) &&
        yearToNumber(sr.maxYear) >= yearToNumber(user.year)
        ? true
        : false;
    });

    if (!correctSpotRange) {
      c.status(400);
      return c.text("You are not eligible for this happening");
    }

    const { questions: inputQuestions } = registrationSchema.parse(await c.req.raw.json());

    const askedQuestions = inputQuestions.filter((iq) => {
      return happening.questions.find((q) => q.title === iq.question);
    });

    if (askedQuestions.length !== happening.questions.length) {
      c.status(400);
      return c.text("Invalid questions");
    }

    const questionsToInsert = happening.questions.map((q) => {
      const inputQuestion = askedQuestions.find((iq) => iq.question === q.title);

      if (!inputQuestion) {
        // Should never happen
        throw new Error("Question not found");
      }

      return {
        questionId: q.id,
        answer: inputQuestion.answer,
      };
    });

    // Get the number of registered registrations that belong to the correct spot range
    // and the happening
    const registeredRegistrations = await db.query.registrations.findMany({
      where: (r) => and(eq(r.happeningSlug, happening.slug), eq(r.status, "registered")),
      with: {
        user: true,
      },
    });

    const registeredRegistrationsInSpotRange = registeredRegistrations.filter((r) => {
      const correctSpotRange = happening.spotRanges.find((sr) => {
        return yearToNumber(sr.minYear) <= yearToNumber(r.user.year) &&
          yearToNumber(sr.maxYear) >= yearToNumber(r.user.year)
          ? true
          : false;
      });

      return correctSpotRange ? true : false;
    }).length;

    const status =
      registeredRegistrationsInSpotRange < correctSpotRange.spots ? "registered" : "waiting";

    const userRegistration = existingRegistration
      ? (
          await db
            .update(registrations)
            .set({
              status,
            })
            .where(
              and(
                eq(registrations.happeningSlug, happening.slug),
                eq(registrations.userId, user.id),
              ),
            )
            .returning()
        )[0]
      : (
          await db
            .insert(registrations)
            .values({
              happeningSlug: happening.slug,
              userId: user.id,
              status,
            })
            .returning()
        )[0];

    if (!userRegistration) {
      throw new Error("Failed to insert registration");
    }

    if (questionsToInsert.length > 0) {
      await db.insert(answers).values(
        questionsToInsert.map((q) => ({
          answer: q.answer,
          questionId: q.questionId,
          registrationId: userRegistration.id,
        })),
      );
    }

    return c.text(`Registration successful, status: ${status}`);
  } catch (e) {
    if (e instanceof z.ZodError) {
      c.status(400);
      return c.json({
        status: "error",
        message: "Invalid data",
        errors: e.errors,
      });
    }

    if (e instanceof DatabaseError) {
      if (e.code === "23505") {
        c.status(400);
        return c.text("Already registered");
      }
    }

    c.status(500);
    return c.text("Something went wrong");
  }
});

/**
 * Unregister a user from a specific happening
 */
happeningService.post("/happening/:slug/unregister", jwt(jwtConfig), async (c) => {
  try {
    const { reason } = unregisterSchema.parse(await c.req.raw.json());

    const jwt = getJwtPayload(c);

    const user = await db.query.users.findFirst({
      where: (u) => eq(u.id, jwt.sub),
    });

    if (!user) {
      c.status(403);
      return c.text("Not logged in");
    }

    const { slug } = c.req.param();

    if (!slug) {
      return c.text("No slug provided");
    }

    const happening = await db.query.happenings.findFirst({
      where: (h) => eq(h.slug, slug),
    });

    if (!happening) {
      return c.text("No happening found");
    }

    const r = await db.query.registrations.findFirst({
      where: (r) => and(eq(r.happeningSlug, happening.slug), eq(r.userId, user.id)),
    });

    if (!r) {
      c.status(404);
      return c.text("No registration found");
    }

    if (r.status === "unregistered") {
      c.status(200);
      return c.text("Already unregistered");
    }

    await db
      .update(registrations)
      .set({
        status: "unregistered",
      })
      .where(
        and(eq(registrations.happeningSlug, happening.slug), eq(registrations.userId, user.id)),
      );

    const email = user.email;
    const subject = `Du har meldt deg av ${happening.title}`;
    const content = `Reason: ${reason}`;

    sendUnregisterEmail(email, subject, content);

    return c.text("Unregistration successful");
  } catch (e) {
    if (e instanceof z.ZodError) {
      c.status(400);
      return c.json({
        status: "error",
        message: "Invalid data",
        errors: e.errors,
      });
    }

    if (e instanceof SyntaxError) {
      c.status(400);
      return c.text("Invalid JSON");
    }

    if (e instanceof DatabaseError) {
      if (e.code === "23505") {
        c.status(400);
        return c.text("Already registered");
      }
    }

    c.status(500);
    return c.text("Something went wrong");
  }
});

/**
 * Get all spot ranges for a specific happening
 */
happeningService.get("/happening/:slug/spot-ranges", jwt(jwtConfig), async (c) => {
  const { slug } = c.req.param();

  const happening = await db.query.happenings.findFirst({
    where: (h) => eq(h.slug, slug),
  });

  if (!happening) {
    c.status(404);
    return c.text("Happening not found");
  }

  const spotRanges = await getSpotRangeByHappening(slug);

  return c.json(spotRanges);
});

export default happeningService;

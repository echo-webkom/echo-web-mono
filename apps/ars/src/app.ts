import { isFuture, isPast } from "date-fns";

import { getCorrectSpotrange } from "./correct-spot-range";
import { createApp } from "./create-app";
import { isUserBanned } from "./is-user-banned";
import { isUserComplete } from "./is-user-complete";
import { doesIntersect } from "./list";
import { logger } from "./logger";
import { auth } from "./middleware";
import {
  getExisitingRegistration,
  getHappening,
  getHostGroups,
  getUser,
  registerUserToHappening,
} from "./queries";
import { registerJsonSchema } from "./schema";

const app = createApp();

app.get("/", (c) => {
  return c.json({
    message: "OK",
  });
});

app.post("/", auth, async (c) => {
  const json = await c.req.json().catch(() => {});
  const { success, data } = registerJsonSchema.safeParse(json);

  if (!success) {
    logger.error("Invalid JSON", json);
    return c.json({ success: false, message: "Ugyldig JSON" });
  }

  const { userId, happeningId, questions } = data;

  const user = await getUser(userId);

  if (!user) {
    logger.error("User not found", {
      userId,
    });
    return c.json({ success: false, message: "Brukeren finnes ikke" });
  }

  const happening = await getHappening(happeningId);

  if (!happening) {
    logger.error("Happening not found", {
      happeningId,
    });
    return c.json({ success: false, message: "Arrangementet finnes ikke" });
  }

  if (!isUserComplete(user)) {
    logger.error("User is not complete", {
      userId,
    });
    return c.json({ success: false, message: "Brukeren er ikke fullført" });
  }

  const isBanned = await isUserBanned(user, happening);
  if (isBanned) {
    logger.error("User is banned", {
      userId,
    });
    return c.json({ success: false, message: "Brukeren er utestengt" });
  }

  const exisitingRegistration = await getExisitingRegistration(userId, happeningId);

  if (exisitingRegistration) {
    logger.error("Registration already exists", {
      userId,
      happeningId,
    });

    const status =
      exisitingRegistration.status === "registered"
        ? "Du er allerede påmeldt dette arrangementet"
        : "Du er allerede på venteliste til dette arrangementet";

    return c.json({
      success: false,
      message: status,
    });
  }

  const canEarlyRegister = doesIntersect(
    happening.registrationGroups ?? [],
    user.memberships.map((membership) => membership.groupId),
  );

  if (!canEarlyRegister && happening.registrationStart && isFuture(happening.registrationStart)) {
    logger.error("Registration is not open", {
      userId,
      happeningId,
    });
    return c.json({ success: false, message: "Påmeldingen har ikke startet" });
  }

  if (!canEarlyRegister && !happening.registrationStart) {
    logger.error("Registration is not open", {
      userId,
      happeningId,
    });
    return c.json({ success: false, message: "Påmelding er bare for inviterte undergrupper" });
  }

  if (happening.registrationEnd && isPast(happening.registrationEnd)) {
    logger.error("Registration is closed", {
      userId,
      happeningId,
    });
    return c.json({ success: false, message: "Påmeldingen har allerede stengt" });
  }

  const hostGroups = await getHostGroups(happeningId);

  const canSkipSpotRange = doesIntersect(
    hostGroups,
    user.memberships.map((membership) => membership.groupId),
  );

  const userSpotRange = getCorrectSpotrange(user.year, happening.spotRanges, canSkipSpotRange);

  if (!userSpotRange) {
    logger.error("User is not in any spot range", {
      userId,
      happeningId,
    });
    return c.json({ success: false, message: "Brukeren er ikke i en plassering" });
  }

  const allQuestionsAnswered = happening.questions.every((question) => {
    const questionExists = questions.find((q) => q.questionId === question.id);
    const questionAnswer = questionExists?.answer;

    return question.required ? !!questionAnswer : true;
  });

  if (!allQuestionsAnswered) {
    logger.error("Not all questions are answered", {
      userId,
      happeningId,
    });
    return c.json({ success: false, message: "Du må svare på alle spørsmålene" });
  }

  const status = await registerUserToHappening(userId, happeningId, userSpotRange);

  if (status === "error") {
    logger.error("Failed to update registration", {
      userId,
      happeningId,
    });
    return c.json({ success: false, message: "Noe gikk galt" });
  }

  const message =
    status === "waitlisted" ? "Du er nå på venteliste" : "Du er nå påmeldt arrangementet";

  return c.json({
    success: true,
    message,
  });
});

export default app;

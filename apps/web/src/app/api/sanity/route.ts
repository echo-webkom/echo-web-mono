import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@echo-webkom/db";
import {
  happenings,
  happeningsToGroups,
  questions,
  registrations,
  spotRanges,
  type HappeningInsert,
  type HappeningsToGroupsInsert,
  type QuestionInsert,
  type SpotRangeInsert,
} from "@echo-webkom/db/schemas";
import { type HappeningType } from "@echo-webkom/lib";

import { withBasicAuth } from "@/lib/checks/with-basic-auth";
import { isBoard } from "@/lib/is-board";
import { client } from "@/sanity/client";
import { happeningQuerySingle, type SanityHappening } from "./sync/query";

export const dynamic = "force-dynamic";

const sanityPayloadSchema = z.object({
  _id: z.string(),
});

const revalidate = (type: HappeningType, slug: string) => {
  revalidatePath("/");
  revalidatePath(`/${type === "bedpres" ? "bedpres" : "arrangement"}/${slug}`);
};

export const POST = withBasicAuth(async (req) => {
  const startTime = new Date().getTime();

  const payload = sanityPayloadSchema.parse(await req.json());

  const res = await client.fetch<SanityHappening | null>(happeningQuerySingle, {
    id: payload._id,
  });

  const shouldDelete = res === null;

  if (shouldDelete) {
    const happening = await db.query.happenings.findFirst({
      where: eq(happenings.id, payload._id),
    });
    await db.delete(happenings).where(eq(happenings.id, payload._id));
    await db.delete(happeningsToGroups).where(eq(happeningsToGroups.happeningId, payload._id));
    await db.delete(questions).where(eq(questions.happeningId, payload._id));
    await db.delete(spotRanges).where(eq(spotRanges.happeningId, payload._id));
    await db.delete(registrations).where(eq(registrations.happeningId, payload._id));

    if (happening) revalidate(happening.type, happening.slug);
    return NextResponse.json(
      {
        status: "success",
        message: `Deleted happening with id ${payload._id}`,
        time: (new Date().getTime() - startTime) / 1000,
      },
      { status: 200 },
    );
  }

  if (res.happeningType === "external") {
    revalidate(res.happeningType, res.slug);
    return NextResponse.json(
      {
        status: "success",
        message: `Happening with id ${payload._id} is external. Nothing done.`,
        time: (new Date().getTime() - startTime) / 1000,
      },
      { status: 200 },
    );
  }

  const validGroups = await db.query.groups.findMany();

  const formattedHappening = {
    ...res,
    id: res._id,
    date: new Date(res.date),
    registrationStartGroups: res.registrationStartGroups
      ? new Date(res.registrationStartGroups)
      : null,
    registrationStart: res.registrationStart ? new Date(res.registrationStart) : null,
    registrationEnd: res.registrationEnd ? new Date(res.registrationEnd) : null,
    registrationGroups:
      res.registrationGroups?.map((group) => (isBoard(group) ? "hovedstyre" : group)) ?? [],
  } satisfies HappeningInsert;

  /**
   * Update or insert happening
   */
  await db
    .insert(happenings)
    .values(formattedHappening)
    .onConflictDoUpdate({
      set: formattedHappening,
      where: eq(happenings.id, res._id),
      target: happenings.id,
    });

  /**
   * Remove previous group mappings and insert new ones
   */
  await db.delete(happeningsToGroups).where(eq(happeningsToGroups.happeningId, res._id));

  if (res.happeningType === "bedpres") {
    const happeningsToGroupsToInsert = (res.groups ?? [])
      .filter((groupId) => validGroups.map((group) => group.id).includes(groupId))
      .map(
        (groupId) =>
          ({
            happeningId: res._id,
            groupId,
          }) satisfies HappeningsToGroupsInsert,
      );

    if (happeningsToGroupsToInsert.length > 0) {
      await db.insert(happeningsToGroups).values(happeningsToGroupsToInsert);
    }
  }

  /**
   * Remove previous spot ranges and insert new ones
   */
  await db.delete(spotRanges).where(eq(spotRanges.happeningId, res._id));

  const spotRangesToInsert: Array<SpotRangeInsert> = (res.spotRanges ?? []).map((sr) => ({
    happeningId: res._id,
    spots: sr.spots,
    minYear: sr.minYear,
    maxYear: sr.maxYear,
  }));

  if (spotRangesToInsert.length > 0) {
    await db.insert(spotRanges).values(spotRangesToInsert);
  }

  const currentQuestions = await db.query.questions.findMany({
    where: eq(questions.happeningId, res._id),
  });

  const questionsToDelete = currentQuestions.filter(
    (q) => !res.questions?.map((newQuestion) => newQuestion.title).includes(q.title),
  );

  for (const question of questionsToDelete) {
    await db.delete(questions).where(eq(questions.id, question.id));
  }

  const questionsToInsert: Array<QuestionInsert> = (res.questions ?? []).map((q) => ({
    id: q.id,
    happeningId: res._id,
    title: q.title,
    required: q.required,
    type: q.type,
    options: q.options?.map((o) => ({
      id: o,
      value: o,
    })),
  }));

  if (questionsToInsert.length > 0) {
    await db
      .insert(questions)
      .values(questionsToInsert)
      .onConflictDoUpdate({
        target: questions.id,
        set: {
          title: sql`excluded."title"`,
          required: sql`excluded."required"`,
          type: sql`excluded."type"`,
          options: sql`excluded."options"`,
          isSensitive: sql`excluded."is_sensitive"`,
        },
      });
  }

  revalidate(res.happeningType, res.slug);

  return NextResponse.json(
    {
      status: "success",
      message: `Happening with id ${payload._id} inserted or updated`,
      time: (new Date().getTime() - startTime) / 1000,
    },
    { status: 200 },
  );
});

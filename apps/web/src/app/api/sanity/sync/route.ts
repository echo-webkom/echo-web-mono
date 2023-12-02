import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import {
  happenings,
  happeningsToGroups,
  questions,
  spotRanges,
  type QuestionInsert,
} from "@echo-webkom/db/schemas";

import { withBasicAuth } from "@/lib/checks/with-basic-auth";
import { client } from "@/sanity/client";
import { happeningQueryList, type SanityHappening } from "./query";

export const dynamic = "force-dynamic";

export const GET = withBasicAuth(async () => {
  const startTime = new Date().getTime();

  const res = await client.fetch<Array<SanityHappening>>(happeningQueryList);

  const formattedHappenings = res.map((h) => ({
    ...h,
    date: new Date(h.date),
    registrationStartGroups: h.registrationStartGroups ? new Date(h.registrationStartGroups) : null,
    registrationStart: h.registrationStart ? new Date(h.registrationStart) : null,
    registrationEnd: h.registrationEnd ? new Date(h.registrationEnd) : null,
  }));

  if (formattedHappenings.length > 0) {
    await db
      .insert(happenings)
      .values(
        formattedHappenings.map((h) => ({
          id: h._id,
          slug: h.slug,
          title: h.title,
          type: h.happeningType,
          date: h.date,
          registrationStart: h.registrationStart,
          registrationEnd: h.registrationEnd,
        })),
      )
      .onConflictDoUpdate({
        target: [happenings.slug],
        set: {
          title: sql`excluded."title"`,
          type: sql`excluded."type"`,
          date: sql`excluded."date"`,
          registrationStart: sql`excluded."registration_start"`,
          registrationEnd: sql`excluded."registration_end"`,
          slug: sql`excluded."slug"`,
        },
      });

    await db.execute(sql`TRUNCATE TABLE ${happeningsToGroups} CASCADE;`);

    const groupsToInsert = formattedHappenings.flatMap((h) => {
      return (h.registrationGroups ?? []).map((g) => ({
        happeningId: h._id,
        groupId: g,
      }));
    });

    if (groupsToInsert.length > 0) {
      await db.insert(happeningsToGroups).values(groupsToInsert);
    }
  }

  await db.execute(sql`TRUNCATE TABLE ${spotRanges} CASCADE;`);

  const spotRangesToInsert = formattedHappenings.flatMap((h) => {
    return (h.spotRanges ?? []).map((sr) => {
      return {
        happeningId: h._id,
        spots: sr.spots,
        minYear: sr.minYear,
        maxYear: sr.maxYear,
      };
    });
  });

  if (spotRangesToInsert.length > 0) {
    await db.insert(spotRanges).values(spotRangesToInsert);
  }

  await db.execute(sql`TRUNCATE TABLE ${questions} CASCADE;`);

  const questionsToInsert: Array<QuestionInsert> = formattedHappenings.flatMap((h) => {
    return (h.questions ?? []).map((q) => {
      return {
        id: q.id,
        happeningId: h._id,
        title: q.title,
        required: q.required,
        isSensitive: q.isSensitive,
        type: q.type,
        options: (q.options ?? []).map((o) => ({ id: o, value: o })),
      };
    });
  });

  if (questionsToInsert.length > 0) {
    await db.insert(questions).values(questionsToInsert);
  }

  revalidatePath("/");

  return NextResponse.json({
    message: "OK",
    time: (new Date().getTime() - startTime) / 1000,
  });
});

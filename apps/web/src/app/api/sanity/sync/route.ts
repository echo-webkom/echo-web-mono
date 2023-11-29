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
import { happeningQuery, type HappeningQueryType } from "./query";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export const GET = withBasicAuth(async () => {
  const startTime = new Date().getTime();

  const res = await client.fetch<HappeningQueryType>(happeningQuery);

  const formattedHappenings = res.map((h) => ({
    ...h,
    date: new Date(h.date),
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
          type: h._type,
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

    await db.insert(happeningsToGroups).values(
      formattedHappenings.flatMap((h) => {
        return (h.groups ?? []).map((g) => ({
          happeningId: h._id,
          groupId: h._type === "bedpres" ? "bedkom" : g,
        }));
      }),
    );
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

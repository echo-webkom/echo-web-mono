import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { happenings, happeningsToGroups, questions, spotRanges } from "@echo-webkom/db/schemas";

import { withBasicAuth } from "@/lib/checks/with-basic-auth";
import { client } from "@/sanity/client";
import { happeningQuery, type HappeningQueryType } from "./query";

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

  await db
    .insert(happenings)
    .values(
      formattedHappenings.map((h) => ({
        id: h.slug,
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
        happeningSlug: h.slug,
        groupId: h._type === "bedpres" ? "bedkom" : g,
      }));
    }),
  );

  await db.execute(sql`TRUNCATE TABLE ${spotRanges} CASCADE;`);

  const spotRangesToInsert = formattedHappenings.flatMap((h) => {
    return (h.spotRanges ?? []).map((sr) => {
      return {
        happeningSlug: h.slug,
        spots: sr.spots,
        minYear: sr.minYear,
        maxYear: sr.maxYear,
      };
    });
  });

  if (spotRangesToInsert.length > 0) {
    await db.insert(spotRanges).values(spotRangesToInsert);
  }

  await db.execute(sql`TRUNCATE TABLE question CASCADE;`);

  const questionsToInsert = formattedHappenings.flatMap((h) => {
    return (h.questions ?? []).map((q) => {
      return {
        happeningSlug: h.slug,
        title: q.title,
        required: q.required,
        type: q.type,
        options: (q.options ?? []).map((o) => ({ id: o, value: o })),
      };
    });
  });

  if (questionsToInsert.length > 0) {
    await db.insert(questions).values(questionsToInsert);
  }

  const endTime = new Date().getTime();
  const totalSeconds = (endTime - startTime) / 1000;

  return NextResponse.json({
    message: "OK",
    timeInSeconds: totalSeconds,
  });
});

import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@echo-webkom/db";
import {
  happenings,
  happeningsToGroups,
  questions,
  registrations,
  spotRanges,
  type HappeningsToGroupsInsert,
  type SpotRangeInsert,
} from "@echo-webkom/db/schemas";

import { withBasicAuth } from "@/lib/checks/with-basic-auth";
import { client } from "@/sanity/client";
import { happeningQuery, type HappeningQueryType } from "./query";

export const dynamic = "force-dynamic";

const sanityPayloadSchema = z.object({
  _id: z.string(),
});

export const POST = withBasicAuth(async (req) => {
  const startTime = new Date().getTime();

  const payload = sanityPayloadSchema.parse(await req.json());

  const res = await client.fetch<HappeningQueryType>(happeningQuery, {
    id: payload._id,
  });

  const shouldDelete = res === null;

  if (shouldDelete) {
    await db.delete(happenings).where(eq(happenings.id, payload._id));
    await db.delete(happeningsToGroups).where(eq(happeningsToGroups.happeningId, payload._id));
    await db.delete(questions).where(eq(questions.happeningId, payload._id));
    await db.delete(spotRanges).where(eq(spotRanges.happeningId, payload._id));
    await db.delete(registrations).where(eq(registrations.happeningId, payload._id));

    // TODO: Revalidate tags (bedpres or event)

    return NextResponse.json(
      {
        status: "success",
        message: `Deleted happening with id ${payload._id}`,
        time: (new Date().getTime() - startTime) / 1000,
      },
      { status: 200 },
    );
  }

  /**
   * Update or insert happening
   */
  await db
    .insert(happenings)
    .values({
      id: res._id,
      type: res._type,
      title: res.title,
      slug: res.slug,
      date: new Date(res.date),
      registrationStart: res.registrationStart ? new Date(res.registrationStart) : null,
      registrationEnd: res.registrationEnd ? new Date(res.registrationEnd) : null,
    })
    .onConflictDoUpdate({
      set: {
        type: res._type,
        title: res.title,
        slug: res.slug,
        date: new Date(res.date),
        registrationStart: res.registrationStart ? new Date(res.registrationStart) : null,
        registrationEnd: res.registrationEnd ? new Date(res.registrationEnd) : null,
      },
      where: eq(happenings.id, res._id),
      target: happenings.id,
    });

  /**
   * Remove previous group mappings and insert new ones
   */
  await db.delete(happeningsToGroups).where(eq(happeningsToGroups.happeningId, res._id));

  if (res._type === "bedpres") {
    await db.insert(happeningsToGroups).values({
      happeningId: res._id,
      groupId: "bedkom",
    });
  } else {
    const happeningsToGroupsToInsert = res.groups.map(
      (g) =>
        ({
          happeningId: res._id,
          groupId: g,
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

  const spotRangesToInsert: Array<SpotRangeInsert> = (res.spotRanges ?? []).map(
    (sr) =>
      ({
        happeningId: res._id,
        spots: sr.spots,
        minYear: sr.minYear,
        maxYear: sr.maxYear,
      }),
  );

  if (spotRangesToInsert.length > 0) {
    await db.insert(spotRanges).values(spotRangesToInsert);
  }


  /**
   * Remove previous questions and insert new ones
   */
  await db.delete(questions).where(eq(questions.happeningId, res._id));

  // TODO: Revalidate tag (bedpres or event)


  return NextResponse.json(
    {
      status: "success",
      message: `Happening with id ${payload._id} inserted or updated`,
      time: (new Date().getTime() - startTime) / 1000,
    },
    { status: 200 },
  );
});

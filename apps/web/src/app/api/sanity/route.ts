import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@echo-webkom/db";
import { happenings } from "@echo-webkom/db/schemas";

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

import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { and, eq, inArray } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import {
  happenings,
  happeningsToGroups,
  questions,
  spotRanges,
  type HappeningInsert,
  type QuestionInsert,
} from "@echo-webkom/db/schemas";

import { withBasicAuth } from "@/lib/checks/with-basic-auth";
import { isBoard } from "@/lib/is-board";
import { toDateOrNull } from "@/utils/date";
import { makeListUnique } from "@/utils/list";
import { type SanityHappening } from "./sync/query";

export const dynamic = "force-dynamic";

function revalidate(slug: string) {
  revalidateTag(`happening-${slug}`);
  revalidateTag("upcoming-happenings");
}

/**
 * Endpoint for syncing happenings from Sanity to the database.
 * Gets triggered by a webhook from Sanity, on create, update and delete of a happening.
 *
 * Data is sent from a GROQ projection in Sanity:
 * ```
 * {
 *   "operation": delta::operation(),
 *   "documentId": _id,
 *   "data": after(){
 *     _id,
 *     title,
 *     body,
 *     "slug": slug.current,
 *     date,
 *     happeningType,
 *     "registrationStartGroups": registrationStartGroups[]->slug.current,
 *     "registrationGroups": registrationGroups[]->slug.current,
 *     "registrationStart": registrationStart,
 *     "registrationEnd": registrationEnd,
 *     "groups": organizers[]->slug.current,
 *     "spotRanges": spotRanges[] {
 *       spots,
 *       minYear,
 *       maxYear
 *     },
 *     "questions": additionalQuestions[] {
 *       id,
 *       title,
 *       required,
 *       type,
 *       isSensitive,
 *       options
 *     }
 *   }
 * }
 * ```
 */
export const POST = withBasicAuth(async (req) => {
  const { operation, documentId, data } = (await req.json()) as unknown as {
    operation: "create" | "update" | "delete";
    documentId: string;
    data: SanityHappening | null;
  };

  // eslint-disable-next-line no-console
  console.log(operation, documentId, JSON.stringify(data));

  if (!["create", "update", "delete"].includes(operation)) {
    return NextResponse.json(
      {
        status: "error",
        message: `Unknown action ${operation}`,
      },
      { status: 400 },
    );
  }

  if (data?.slug) {
    revalidate(data.slug);
  }

  /**
   * If the happening is external, we don't want to do anything. Since
   * we are not responsible for the registrations of external happenings.
   */
  if (data?.happeningType === "external") {
    return NextResponse.json(
      {
        message: `Happening with id ${data._id} is external. Nothing done.`,
      },
      { status: 200 },
    );
  }

  if (operation === "delete") {
    /**
     * Delete the happening. Tables with foreign keys will be deleted automatically.
     */
    const happening = await db
      .delete(happenings)
      .where(eq(happenings.id, documentId))
      .returning({ slug: happenings.slug })
      .then((res) => res[0]);

    if (!happening) {
      return NextResponse.json(
        {
          status: "error",
          message: `Happening with id ${documentId} not found`,
        },
        { status: 404 },
      );
    }

    revalidate(happening.slug);

    return NextResponse.json(
      {
        status: "success",
        message: `Deleted happening with id ${documentId}`,
      },
      { status: 200 },
    );
  }

  /**
   * If no data is provided and the operation is not delete, we can't do anything.
   * Most likely a sanity bug.
   */
  if (!data) {
    console.error("Can't update or insert happening without data");
    console.error({
      operation,
      documentId,
      data,
    });
    return NextResponse.json(
      {
        status: "error",
        message: `No data provided`,
      },
      { status: 400 },
    );
  }

  if (operation === "create") {
    const happening = mapHappening(data);

    await db.insert(happenings).values(happening);

    const happeningToGroupsToInsert = await mapHappeningToGroups(data.groups ?? []);

    if (happeningToGroupsToInsert.length > 0) {
      await db.insert(happeningsToGroups).values(
        happeningToGroupsToInsert.map((groupId) => ({
          happeningId: happening.id,
          groupId,
        })),
      );
    }

    const spotRangesToInsert = (data.spotRanges ?? []).map((sr) => ({
      happeningId: happening.id,
      spots: sr.spots,
      minYear: sr.minYear,
      maxYear: sr.maxYear,
    }));

    if (spotRangesToInsert.length > 0) {
      await db.insert(spotRanges).values(spotRangesToInsert);
    }

    const questionsToInsert = (data.questions ?? []).map((q) => ({
      id: q.id,
      happeningId: happening.id,
      title: q.title,
      required: q.required,
      type: q.type,
      options: q.options?.map((o) => ({
        id: o,
        value: o,
      })),
    })) satisfies Array<QuestionInsert>;

    if (questionsToInsert.length > 0) {
      await db.insert(questions).values(questionsToInsert);
    }

    return NextResponse.json(
      {
        status: "success",
        message: `Happening with id ${data._id} inserted`,
      },
      { status: 200 },
    );
  }

  if (operation === "update") {
    const happening = mapHappening(data);

    await db.update(happenings).set(happening).where(eq(happenings.id, happening.id));

    await db.delete(happeningsToGroups).where(eq(happeningsToGroups.happeningId, happening.id));

    const happeningToGroupsToInsert = await mapHappeningToGroups(data.groups ?? []);

    if (happeningToGroupsToInsert.length > 0) {
      await db.insert(happeningsToGroups).values(
        happeningToGroupsToInsert.map((groupId) => ({
          happeningId: happening.id,
          groupId,
        })),
      );
    }

    await db.delete(spotRanges).where(eq(spotRanges.happeningId, happening.id));

    const spotRangesToInsert = (data.spotRanges ?? []).map((sr) => ({
      happeningId: happening.id,
      spots: sr.spots,
      minYear: sr.minYear,
      maxYear: sr.maxYear,
    }));

    if (spotRangesToInsert.length > 0) {
      await db.insert(spotRanges).values(spotRangesToInsert);
    }

    const oldQuestions = await db.query.questions.findMany({
      where: eq(questions.happeningId, happening.id),
    });

    const incomingQuestions = (data.questions ?? []).map((q) => ({
      id: q.id,
      happeningId: happening.id,
      title: q.title,
      required: q.required,
      type: q.type,
      options: q.options?.map((o) => ({
        id: o,
        value: o,
      })),
    })) satisfies Array<QuestionInsert>;

    /**
     * Questions to delete are questions that are in the database, but not in the incoming data
     */
    const questionsToDelete = oldQuestions.filter(
      (oldQuestion) => !incomingQuestions.map((q) => q.id).includes(oldQuestion.id),
    );

    /**
     * Questions to update are questions that are in the database, and also in the incoming data
     */
    const questionsToUpdate = incomingQuestions.filter((newQuestion) =>
      oldQuestions.map((q) => q.id).includes(newQuestion.id),
    );

    /**
     * Questions to insert are questions that are not in the database, but are in the incoming data
     */
    const questionsToInsert = incomingQuestions.filter(
      (newQuestion) => !questionsToUpdate.map((q) => q.id).includes(newQuestion.id),
    );

    if (questionsToDelete.length > 0) {
      await db.delete(questions).where(
        and(
          eq(questions.happeningId, happening.id),
          inArray(
            questions.id,
            questionsToDelete.map((q) => q.id),
          ),
        ),
      );
    }

    if (questionsToInsert.length > 0) {
      await db.insert(questions).values(questionsToInsert);
    }

    if (questionsToUpdate.length > 0) {
      await Promise.all(
        questionsToUpdate.map((question) =>
          db.update(questions).set(question).where(eq(questions.id, question.id)),
        ),
      );
    }

    return NextResponse.json(
      {
        status: "success",
        message: `Happening with id ${data._id} updated`,
      },
      { status: 200 },
    );
  }

  return NextResponse.json(
    {
      status: "error",
      message: `Unknown action ${operation}`,
    },
    { status: 400 },
  );
});

/**
 * Maps a SanityHappening to a HappeningInsert with the correct types
 *
 * @param document the document to map
 * @returns an insertable happening
 */
function mapHappening(document: SanityHappening) {
  return {
    id: document._id,
    date: new Date(document.date),
    registrationStartGroups: toDateOrNull(document.registrationStartGroups),
    registrationStart: toDateOrNull(document.registrationStart),
    registrationEnd: toDateOrNull(document.registrationEnd),
    registrationGroups:
      document.registrationGroups?.map((group) => (isBoard(group) ? "hovedstyre" : group)) ?? [],
    slug: document.slug,
    title: document.title,
    type: document.happeningType,
  } satisfies HappeningInsert;
}

/**
 * Maps an array of group ids to an array of valid group ids.
 * Removes invalid groups and maps board to hovedstyre
 *
 * @param groups groups to map
 * @returns insertable happeningToGroups
 */
async function mapHappeningToGroups(groups: Array<string>) {
  const validGroups = await db.query.groups.findMany();

  return makeListUnique(
    groups
      .filter((groupId) => validGroups.map((group) => group.id).includes(groupId))
      .map((groupId) => (isBoard(groupId) ? "hovedstyre" : groupId)),
  );
}

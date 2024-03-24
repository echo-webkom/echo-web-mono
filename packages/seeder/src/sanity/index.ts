import { inArray, sql } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import {
  happenings,
  happeningsToGroups,
  questions,
  spotRanges,
  type HappeningInsert,
  type QuestionInsert,
} from "@echo-webkom/db/schemas";
import { isBoard } from "@echo-webkom/lib";

import { client } from "./client";
import { happeningQueryList, type SanityHappening } from "./query";

export const seed = async () => {
  const res = await client.fetch<Array<SanityHappening>>(happeningQueryList);

  const formattedHappenings = res
    .filter((happening) => happening.happeningType !== "external")
    .map((h) => ({
      ...h,
      date: new Date(h.date),
      registrationStartGroups: h.registrationStartGroups
        ? new Date(h.registrationStartGroups)
        : null,
      registrationStart: h.registrationStart ? new Date(h.registrationStart) : null,
      registrationEnd: h.registrationEnd ? new Date(h.registrationEnd) : null,
      registrationGroups:
        h.registrationGroups?.map((group) => (isBoard(group) ? "hovedstyre" : group)) ?? [],
      groups: h.groups?.map((group) => (isBoard(group) ? "hovedstyre" : group)) ?? [],
    }));

  await db.transaction(async (tx) => {
    if (formattedHappenings.length > 0) {
      await tx
        .insert(happenings)
        .values(
          formattedHappenings.map(
            (h) =>
              ({
                id: h._id,
                slug: h.slug,
                title: h.title,
                type: h.happeningType,
                date: h.date,
                registrationStart: h.registrationStart,
                registrationEnd: h.registrationEnd,
                registrationStartGroups: h.registrationStartGroups,
                registrationGroups: h.registrationGroups,
              }) satisfies HappeningInsert,
          ),
        )
        .onConflictDoUpdate({
          target: [happenings.slug],
          set: {
            title: sql`excluded."title"`,
            type: sql`excluded."type"`,
            date: sql`excluded."date"`,
            registrationStart: sql`excluded."registration_start"`,
            registrationEnd: sql`excluded."registration_end"`,
            registrationStartGroups: sql`excluded."registration_start_groups"`,
            registrationGroups: sql`excluded."registration_groups"`,
            slug: sql`excluded."slug"`,
          },
        });

      await tx.delete(happeningsToGroups).where(
        inArray(
          happeningsToGroups.happeningId,
          formattedHappenings.map((h) => h._id),
        ),
      );

      const validGroups = await tx.query.groups.findMany();

      const groupsToInsert = formattedHappenings.flatMap((h) => {
        return (h.groups ?? [])
          .filter((groupId) => validGroups.map((group) => group.id).includes(groupId))
          .map((groupId) => ({
            happeningId: h._id,
            groupId,
          }));
      });

      if (groupsToInsert.length > 0) {
        await tx.insert(happeningsToGroups).values(groupsToInsert);
      }
    }

    await tx.delete(spotRanges).where(
      inArray(
        spotRanges.happeningId,
        formattedHappenings.map((h) => h._id),
      ),
    );

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
      await tx.insert(spotRanges).values(spotRangesToInsert);
    }

    await tx.delete(questions).where(
      inArray(
        questions.happeningId,
        formattedHappenings.map((h) => h._id),
      ),
    );

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
      await tx.insert(questions).values(questionsToInsert);
    }
  });
};

import { desc, eq, type InferInsertModel } from "drizzle-orm";

import { db } from "../drizzle";
import { happenings, spotRanges, type HappeningType } from "../schemas";

type HappeningOptions = {
  limit?: number;
  offset?: number;
  type?: HappeningType;
};

export const getHappenings = async (options?: HappeningOptions) => {
  const { limit, offset, type } = options ?? {};

  return await db.query.happenings.findMany({
    where: (h) => {
      if (type) {
        return eq(h.type, type);
      }
    },
    orderBy: (h) => desc(h.date),
    limit,
    offset,
  });
};

export const getHappening = async (slug: string) => {
  return (
    await db.query.happenings.findMany({
      where: (h) => eq(h.slug, slug),
      with: {
        spotRanges: true,
        questions: true,
      },
    })
  )[0]!;
};

export const createHappening = async (
  happening: InferInsertModel<typeof happenings>,
  sr: Array<InferInsertModel<typeof spotRanges>>,
) => {
  try {
    const insertedHappening = await db.transaction(async (tx) => {
      const h = await tx.insert(happenings).values(happening).returning();
      await tx
        .insert(spotRanges)
        .values(sr.map((s) => ({ ...s, happeningSlug: h[0]!.slug })))
        .returning();

      return h[0]!;
    });

    return insertedHappening;
  } catch (e) {
    console.error("FAILED TO CREATE HAPPENING", e);
  }
};

export const updateHappening = async (
  slug: string,
  happening: InferInsertModel<typeof happenings>,
) => {
  return (
    await db
      .update(happenings)
      .set({ ...happening })
      .where(eq(happenings.slug, slug))
      .returning()
  )[0]!;
};

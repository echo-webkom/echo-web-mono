import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { type Happening } from "@echo-webkom/db/schemas";

export async function getHappeningBySlug(slug: Happening["slug"]) {
  return await db.query.happenings.findFirst({
    where: (happening) => eq(happening.slug, slug),
    with: {
      questions: true,
    },
  });
}

import { eq } from "drizzle-orm";

import { type Happening } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

export const getFullHappening = async (slug: Happening["slug"]) => {
  return await db.query.happenings.findFirst({
    where: (happening) => eq(happening.slug, slug),
    with: {
      registrations: {
        with: {
          answers: true,
          user: true,
        },
      },
      questions: true,
      groups: true,
    },
  });
};
